"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mic } from "lucide-react";
import { ChatOverlay } from "@/components/chat-overlay";
import { VoiceSession } from "@/components/voice-session";
import { useVoiceConversation } from "@/hooks/use-voice-conversation";
import { streamPortfolioChat, type ChatInputMode, type ChatMessage } from "@/lib/chat";
import { isBrowserVoiceSupported } from "@/lib/voice";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "What has Naman built?",
  "Ask anything about Naman...",
  "Ask about my experience...",
  "Ask me about AI...",
  "How does Naman approach system design?",
];

function Composer({
  query,
  onQuery,
  onSend,
  onMic,
  placeholder,
  pending,
  micActive,
}: {
  query: string;
  onQuery: (value: string) => void;
  onSend: (value: string) => void;
  onMic: () => void;
  placeholder: string;
  pending: boolean;
  micActive: boolean;
}) {
  return (
    <form
      className="flex h-[82px] items-center gap-3 rounded-full border border-line-strong/70 bg-surface/35 px-6 shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      onSubmit={(event) => {
        event.preventDefault();
        onSend(query);
      }}
    >
      <input
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Ask anything about Naman"
        className="h-full flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint placeholder:text-[14px]"
      />
      <button
        type="button"
        onClick={onMic}
        disabled={pending}
        aria-label="Start voice conversation"
        aria-pressed={micActive}
        className={cn(
          "flex h-[44px] w-[44px] items-center justify-center rounded-full border text-ink-soft transition-colors",
          micActive
            ? "border-accent/40 bg-accent/15 text-accent"
            : "border-line bg-transparent hover:border-accent/70 hover:text-accent",
          "disabled:opacity-40",
        )}
      >
        <Mic size={18} />
      </button>
      <button
        type="submit"
        disabled={pending || !query.trim()}
        aria-label="Send question"
        className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-accent/35 bg-accent/10 text-accent transition-colors hover:border-accent/80 hover:bg-accent/16 disabled:opacity-40"
      >
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}

export function AskNaman() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [turns, setTurns] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  const send = useCallback(async (text: string, inputMode: ChatInputMode, signal?: AbortSignal) => {
    const message = text.trim();
    if (!message || pendingRef.current) {
      throw new Error("pending");
    }

    pendingRef.current = true;
    setQuery("");
    setOpen(true);
    setPending(true);

    const assistantId = crypto.randomUUID();
    setTurns((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: message, inputMode },
      { id: assistantId, role: "assistant", content: "", inputMode, streaming: true },
    ]);

    try {
      const accumulated = await streamPortfolioChat(
        message,
        (snapshot) => {
          setTurns((current) =>
            current.map((turn) =>
              turn.id === assistantId ? { ...turn, content: snapshot, streaming: true } : turn,
            ),
          );
        },
        signal,
      );

      setTurns((current) =>
        current.map((turn) =>
          turn.id === assistantId
            ? { ...turn, content: accumulated, streaming: false }
            : turn,
        ),
      );
      return accumulated;
    } catch (error) {
      if (signal?.aborted) {
        setTurns((current) =>
          current.filter((turn) => !(turn.id === assistantId && !turn.content)),
        );
        throw error;
      }

      const fallback =
        "The assistant is temporarily unavailable. I can still only answer from Naman's portfolio once the connection is restored.";
      setTurns((current) =>
        current.map((turn) =>
          turn.id === assistantId
            ? { ...turn, content: fallback, streaming: false }
            : turn,
        ),
      );
      throw error;
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }, []);

  const voice = useVoiceConversation({
    ask: (transcript, signal) => send(transcript, "voice", signal),
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((value) => (value + 1) % PLACEHOLDERS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  const endConversation = voice.endConversation;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      endConversation();
      setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [endConversation]);

  function closeOverlay() {
    voice.endConversation();
    setOpen(false);
  }

  function endVoice() {
    const hadTurns = turns.length > 0;
    voice.endConversation();
    if (!hadTurns) setOpen(false);
  }

  const composer = (
    <div className="space-y-2">
      <Composer
        query={query}
        onQuery={setQuery}
        onSend={(value) => {
          void send(value, "text").catch(() => undefined);
        }}
        onMic={() => {
          voice.dismissUnsupportedNotice();
          if (isBrowserVoiceSupported()) setOpen(true);
          void voice.startConversation();
        }}
        placeholder={PLACEHOLDERS[placeholderIndex]}
        pending={pending}
        micActive={voice.session}
      />
      {voice.unsupportedNotice && (
        <p role="status" className="px-3 text-center text-xs leading-5 text-ink-muted">
          {voice.unsupportedNotice}
        </p>
      )}
    </div>
  );

  return (
    <>
      {!open && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(26px,env(safe-area-inset-bottom))] sm:px-6">
          <div className="pointer-events-auto mx-auto w-full sm:w-[min(55vw,1120px)]">{composer}</div>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <ChatOverlay
            turns={turns}
            pending={pending}
            reduce={Boolean(reduce)}
            onClose={closeOverlay}
            composer={composer}
            voiceActive={voice.session}
            voicePanel={
              <VoiceSession
                state={voice.state}
                interimTranscript={voice.interimTranscript}
                errorMessage={voice.errorMessage}
                amplitude={voice.amplitude}
                reduce={Boolean(reduce)}
                onStopListening={endVoice}
                onEnd={endVoice}
                onRetry={() => {
                  void voice.retry();
                }}
              />
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}
