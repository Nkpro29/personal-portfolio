"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionValue } from "framer-motion";
import {
  createBrowserVoiceProvider,
  isBrowserVoiceSupported,
  voiceErrorMessage,
  type VoiceErrorCode,
  type VoiceProvider,
  type VoiceState,
} from "@/lib/voice";

type AskFn = (transcript: string, signal: AbortSignal) => Promise<string>;

function subscribeNoop() {
  return () => undefined;
}

export function useVoiceConversation({ ask }: { ask: AskFn }) {
  const [state, setState] = useState<VoiceState>("idle");
  const [session, setSession] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unsupportedNotice, setUnsupportedNotice] = useState<string | null>(null);
  const amplitude = useMotionValue(0);
  const supported = useSyncExternalStore(
    subscribeNoop,
    isBrowserVoiceSupported,
    () => false,
  );

  const stateRef = useRef<VoiceState>("idle");
  const sessionRef = useRef(false);
  const cycleRef = useRef(0);
  const providerRef = useRef<VoiceProvider | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const askRef = useRef(ask);
  const failRef = useRef<(code: VoiceErrorCode) => void>(() => undefined);
  const handleFinalRef = useRef<(text: string) => Promise<void>>(async () => undefined);

  const setMachine = useCallback((next: VoiceState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const fail = useCallback(
    (code: VoiceErrorCode) => {
      providerRef.current?.stopListening();
      setInterimTranscript("");
      amplitude.set(0);
      setErrorMessage(voiceErrorMessage(code));
      setMachine("error");
    },
    [amplitude, setMachine],
  );

  const disposeProvider = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    providerRef.current?.dispose();
    providerRef.current = null;
    amplitude.set(0);
  }, [amplitude]);

  const exitToIdle = useCallback(() => {
    cycleRef.current += 1;
    sessionRef.current = false;
    setSession(false);
    setInterimTranscript("");
    setErrorMessage(null);
    disposeProvider();
    setMachine("idle");
  }, [disposeProvider, setMachine]);

  const handleFinal = useCallback(
    async (text: string) => {
      const transcript = text.trim();
      if (!transcript || !sessionRef.current) return;

      const cycle = cycleRef.current;
      const provider = providerRef.current;
      if (!provider) return;

      setInterimTranscript("");
      amplitude.set(0);
      setMachine("processing");

      abortRef.current?.abort();
      const abort = new AbortController();
      abortRef.current = abort;

      try {
        await askRef.current(transcript, abort.signal);
        if (cycle !== cycleRef.current || !sessionRef.current) return;

        setMachine("listening");
        await provider.startListening();
      } catch (error) {
        if (abort.signal.aborted || cycle !== cycleRef.current || !sessionRef.current) {
          return;
        }
        const code: VoiceErrorCode =
          error instanceof Error && error.message === "synthesis-failure"
            ? "synthesis-failure"
            : "network-failure";
        failRef.current(code);
      }
    },
    [amplitude, setMachine],
  );

  useEffect(() => {
    askRef.current = ask;
    failRef.current = fail;
    handleFinalRef.current = handleFinal;
  }, [ask, fail, handleFinal]);

  const ensureProvider = useCallback(() => {
    const existing = providerRef.current;
    if (existing) return existing;

    const provider = createBrowserVoiceProvider({
      onInterimTranscript: (text) => {
        if (!sessionRef.current) return;
        setInterimTranscript(text);
      },
      onAmplitude: (value) => amplitude.set(value),
      onFinalTranscript: (text) => {
        void handleFinalRef.current(text);
      },
      onError: (code) => {
        if (!sessionRef.current) return;
        failRef.current(code);
      },
    });

    providerRef.current = provider;
    return provider;
  }, [amplitude]);

  useEffect(() => {
    return () => {
      cycleRef.current += 1;
      sessionRef.current = false;
      abortRef.current?.abort();
      providerRef.current?.dispose();
      providerRef.current = null;
    };
  }, []);

  const startListeningCycle = useCallback(async () => {
    const provider = ensureProvider();
    setErrorMessage(null);
    setInterimTranscript("");
    setMachine("listening");
    await provider.startListening();
  }, [ensureProvider, setMachine]);

  const startConversation = useCallback(async () => {
    if (!isBrowserVoiceSupported()) {
      setUnsupportedNotice(
        "Voice input isn't supported in this browser. You can still ask Naman anything using text.",
      );
      return;
    }

    if (stateRef.current === "processing") return;

    if (stateRef.current === "listening") return;

    cycleRef.current += 1;
    sessionRef.current = true;
    setSession(true);
    setUnsupportedNotice(null);
    ensureProvider().unlock();
    await startListeningCycle();
  }, [ensureProvider, startListeningCycle]);

  const stopListening = useCallback(() => {
    if (stateRef.current !== "listening") return;
    exitToIdle();
  }, [exitToIdle]);

  const endConversation = useCallback(() => {
    if (!sessionRef.current && stateRef.current === "idle") return;
    exitToIdle();
  }, [exitToIdle]);

  const retry = useCallback(async () => {
    cycleRef.current += 1;
    sessionRef.current = true;
    setSession(true);
    ensureProvider().unlock();
    await startListeningCycle();
  }, [ensureProvider, startListeningCycle]);

  const dismissUnsupportedNotice = useCallback(() => {
    setUnsupportedNotice(null);
  }, []);

  return {
    state,
    session,
    supported,
    interimTranscript,
    errorMessage,
    unsupportedNotice,
    amplitude,
    startConversation,
    stopListening,
    endConversation,
    retry,
    dismissUnsupportedNotice,
  };
}
