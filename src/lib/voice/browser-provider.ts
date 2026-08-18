import { recognitionErrorCode } from "@/lib/voice/errors";
import {
  DEFAULT_SPEAK_OPTIONS,
  type SpeakOptions,
  type VoiceProvider,
  type VoiceProviderListeners,
} from "@/lib/voice/types";

const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

function speechRecognitionCtor() {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

export function isBrowserVoiceSupported() {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext) return false;
  return Boolean(speechRecognitionCtor());
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function speakableText(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string, max = 160) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const piece = sentence.trim();
    if (!piece) continue;
    const next = current ? `${current} ${piece}` : piece;
    if (next.length > max && current) {
      chunks.push(current);
      current = piece;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]) {
  const english = voices.filter((voice) => /^en([-_]|$)/i.test(voice.lang));
  const pool = english.length ? english : voices;
  if (!pool.length) return null;

  // Chrome on macOS often starts native voices with no audible output.
  // Google network voices are the ones that actually play sound.
  const googleUs = pool.find(
    (voice) => /google/i.test(voice.name) && /en-US/i.test(voice.lang),
  );
  if (googleUs) return googleUs;
  const google = pool.find((voice) => /google/i.test(voice.name));
  if (google) return google;

  return pool.find((voice) => /en-US/i.test(voice.lang)) || pool[0] || null;
}

function loadVoices() {
  try {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length) return Promise.resolve(existing);
  } catch {
    return Promise.resolve([]);
  }

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const finish = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", finish);
      try {
        resolve(window.speechSynthesis.getVoices());
      } catch {
        resolve([]);
      }
    };
    window.speechSynthesis.addEventListener("voiceschanged", finish);
    window.setTimeout(finish, 800);
  });
}

export class BrowserVoiceProvider implements VoiceProvider {
  readonly id = "browser-speech";

  private listeners: VoiceProviderListeners;
  private recognition: SpeechRecognition | null = null;
  private rafId = 0;
  private utterance: SpeechSynthesisUtterance | null = null;
  private speakFinish: ((reason: "completed" | "canceled") => void) | null = null;
  private speakKeepAlive = 0;
  private speakCancelled = false;
  private listening = false;
  private disposed = false;
  private finalized = false;
  private unlockAudio: HTMLAudioElement | null = null;
  private replyAudio: HTMLAudioElement | null = null;
  private replyAudioUrl: string | null = null;
  private recognitionEnded: Promise<void> | null = null;
  /** Chrome can GC utterances mid-speech unless we keep references. */
  private utteranceRefs: SpeechSynthesisUtterance[] = [];

  private debugEnabled() {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window as unknown as { __NamanVoiceDebug?: boolean }).__NamanVoiceDebug,
    );
  }

  constructor(listeners: VoiceProviderListeners = {}) {
    this.listeners = listeners;
  }

  setListeners(listeners: VoiceProviderListeners) {
    this.listeners = listeners;
  }

  isSupported() {
    return isBrowserVoiceSupported();
  }

  unlock() {
    if (typeof window === "undefined") return;
    try {
      void loadVoices();
      if (!this.unlockAudio) {
        this.unlockAudio = new Audio(SILENT_WAV);
        this.unlockAudio.preload = "auto";
      }
      this.unlockAudio.currentTime = 0;
      void this.unlockAudio.play().catch(() => undefined);

      const synth = window.speechSynthesis;
      if (synth.paused) synth.resume();
    } catch {
      // Unlock is best-effort.
    }

    if (this.debugEnabled()) {
      console.log("[voice] unlock");
    }
  }

  async startListening() {
    if (this.disposed) return;
    if (!this.isSupported()) {
      this.listeners.onError?.("unsupported");
      return;
    }

    await this.waitForRecognitionEnd();
    this.finalized = false;

    const Ctor = speechRecognitionCtor();
    if (!Ctor) {
      this.listeners.onError?.("unsupported");
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (!result?.[0]) return;
      const transcript = result[0].transcript.trim();
      if (!transcript) return;

      if (result.isFinal) {
        if (this.finalized) return;
        this.finalized = true;
        this.listeners.onInterimTranscript?.(transcript);
        void this.waitForRecognitionEnd().then(() => {
          this.listeners.onFinalTranscript?.(transcript);
        });
        return;
      }

      this.listeners.onInterimTranscript?.(transcript);
    };

    recognition.onerror = (event) => {
      const mapped = recognitionErrorCode(event.error);
      if (mapped === "ignored") return;
      if (mapped === "no-speech") {
        this.listeners.onError?.("recognition-failure");
        return;
      }
      this.listeners.onError?.(mapped);
    };

    this.recognition = recognition;
    this.listening = true;
    this.startIdleAmplitude();
    this.recognitionEnded = new Promise((resolve) => {
      recognition.onend = () => {
        this.listening = false;
        if (this.recognition === recognition) this.recognition = null;
        this.stopIdleAmplitude();
        resolve();
      };
    });

    try {
      recognition.start();
    } catch {
      this.listening = false;
      this.recognition = null;
      this.stopIdleAmplitude();
      this.listeners.onError?.("recognition-failure");
    }
  }

  stopListening() {
    void this.waitForRecognitionEnd();
  }

  async speak(text: string, options: SpeakOptions = {}): Promise<"played" | "silent" | "canceled"> {
    if (this.disposed) return "canceled";

    const spoken = speakableText(text);
    if (!spoken) return "silent";

    this.speakCancelled = false;
    const settings = { ...DEFAULT_SPEAK_OPTIONS, ...options };

    const wasListening = this.listening;

    await this.waitForRecognitionEnd();
    if (wasListening) {
      await delay(150);
    }
    if (this.disposed || this.speakCancelled) return "canceled";

    const serverAudioResult = await this.playServerAudio(spoken);
    if (serverAudioResult === "played" || serverAudioResult === "silent") {
      return serverAudioResult;
    }
    if (this.disposed || this.speakCancelled) return "canceled";

    const voices = await loadVoices();
    if (this.disposed || this.speakCancelled) return "canceled";

    const voice = pickEnglishVoice(voices);
    const chunks = chunkText(spoken);
    let played = false;

    if (this.debugEnabled()) {
      console.log("[voice] speak", {
        chunks: chunks.length,
        voice: voice?.name ?? "default",
        textPreview: spoken.slice(0, 80),
      });
    }

    for (const chunk of chunks) {
      if (this.disposed || this.speakCancelled) return played ? "played" : "canceled";
      const result = await this.playUtterance(chunk, settings, voice);
      if (result === "canceled") return played ? "played" : "canceled";
      if (result === "played") played = true;
    }

    return played ? "played" : "silent";
  }

  stopSpeaking() {
    this.abortSpeaking();
  }

  /** Stop any in-flight utterance without marking the session as canceled. */
  private abortSpeaking() {
    this.speakCancelled = true;
    this.clearSpeechTimers();
    this.stopReplyAudio();
    const finish = this.speakFinish;
    this.utterance = null;
    this.speakFinish = null;
    finish?.("canceled");
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Some browsers throw if nothing is speaking.
    }
  }

  dispose() {
    this.disposed = true;
    this.stopListening();
    this.stopSpeaking();
    this.unlockAudio?.pause();
    this.unlockAudio = null;
  }

  private clearSpeechTimers() {
    if (this.speakKeepAlive) {
      window.clearInterval(this.speakKeepAlive);
      this.speakKeepAlive = 0;
    }
  }

  private holdUtterance(utterance: SpeechSynthesisUtterance) {
    this.utteranceRefs.push(utterance);
  }

  private releaseUtterance(utterance: SpeechSynthesisUtterance) {
    this.utteranceRefs = this.utteranceRefs.filter((item) => item !== utterance);
  }

  private stopReplyAudio() {
    this.replyAudio?.pause();
    this.replyAudio = null;
    if (this.replyAudioUrl) {
      URL.revokeObjectURL(this.replyAudioUrl);
      this.replyAudioUrl = null;
    }
  }

  private async playServerAudio(text: string): Promise<"played" | "silent" | "canceled"> {
    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        if (this.debugEnabled()) {
          console.log("[voice] server audio unavailable", { status: response.status });
        }
        return "canceled";
      }

      const blob = await response.blob();
      if (!blob.size) return "silent";
      if (this.disposed || this.speakCancelled) return "canceled";

      this.stopReplyAudio();
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      audio.src = url;
      audio.preload = "auto";

      this.replyAudio = audio;
      this.replyAudioUrl = url;

      try {
        await audio.play();
      } catch (error) {
        if (this.debugEnabled()) {
          console.log("[voice] server audio play blocked", { error });
        }
        this.stopReplyAudio();
        return "silent";
      }

      return await new Promise<"played" | "silent" | "canceled">((resolve) => {
        let settled = false;
        const finish = (result: "played" | "silent" | "canceled") => {
          if (settled) return;
          settled = true;
          audio.onended = null;
          audio.onerror = null;
          this.stopReplyAudio();
          resolve(result);
        };

        audio.onended = () => finish("played");
        audio.onerror = () => finish("silent");

        if (this.debugEnabled()) {
          console.log("[voice] server audio started", { duration: audio.duration || null });
        }
      });
    } catch (error) {
      if (this.debugEnabled()) {
        console.log("[voice] server audio failed", { error });
      }
      return "canceled";
    }
  }

  private waitForRecognitionEnd() {
    const recognition = this.recognition;
    this.listening = false;
    this.stopIdleAmplitude();

    if (!recognition) return this.recognitionEnded ?? Promise.resolve();

    const ended = this.recognitionEnded ?? Promise.resolve();
    try {
      recognition.abort();
    } catch {
      try {
        recognition.stop();
      } catch {
        this.recognition = null;
        return Promise.resolve();
      }
    }

    return Promise.race([
      ended,
      delay(1200),
    ]).then(() => {
      if (this.recognition === recognition) this.recognition = null;
    });
  }

  private async playUtterance(
    text: string,
    settings: Required<SpeakOptions>,
    voice: SpeechSynthesisVoice | null,
  ): Promise<"played" | "silent" | "canceled"> {
    const primary = await this.playUtteranceAttempt(text, settings, voice);
    if (primary !== "canceled") return primary;

    if (this.debugEnabled()) {
      console.log("[voice] retrying without explicit voice");
    }

    await delay(120);
    if (this.disposed || this.speakCancelled) return "canceled";
    return this.playUtteranceAttempt(text, settings, null);
  }

  private playUtteranceAttempt(
    text: string,
    settings: Required<SpeakOptions>,
    voice: SpeechSynthesisVoice | null,
  ) {
    return new Promise<"played" | "silent" | "canceled">((resolve, reject) => {
      if (this.disposed || this.speakCancelled) {
        resolve("canceled");
        return;
      }

      let settled = false;
      let heard = false;
      const synth = window.speechSynthesis;

      const finish = (reason: "played" | "silent" | "canceled") => {
        if (settled) return;
        settled = true;
        this.clearSpeechTimers();
        this.utterance = null;
        this.speakFinish = null;
        this.releaseUtterance(utterance);
        resolve(reason);
        if (this.debugEnabled()) {
          console.log("[voice] finish", { reason, heard });
        }
        this.listeners.onSpeakEnd?.(reason === "canceled" ? "canceled" : "completed");
      };

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = settings.lang;
      }

      this.holdUtterance(utterance);
      this.utterance = utterance;
      this.speakFinish = () => finish("canceled");

      utterance.onstart = () => {
        heard = true;
        if (this.debugEnabled()) {
          console.log("[voice] onstart");
        }
      };
      utterance.onend = () => finish(heard ? "played" : "silent");
      utterance.onerror = (event) => {
        if (this.debugEnabled()) {
          console.log("[voice] onerror", { error: event.error });
        }
        // `not-allowed` is typically the "audio playback not permitted without a gesture"
        // case (e.g., autoplay/gesture heuristics on some setups).
        // Treat it like `silent` so the UI can present a "Tap to hear" affordance.
        if (event.error === "not-allowed") {
          finish("silent");
          return;
        }

        const canceled = event.error === "canceled" || event.error === "interrupted";
        if (canceled) {
          finish(heard ? "played" : "canceled");
          return;
        }
        this.clearSpeechTimers();
        this.utterance = null;
        this.speakFinish = null;
        this.releaseUtterance(utterance);
        this.listeners.onError?.("synthesis-failure");
        reject(new Error("synthesis-failure"));
      };

      if (settled || this.disposed || this.speakCancelled) {
        finish("canceled");
        return;
      }

      const start = () => {
        if (settled || this.disposed || this.speakCancelled) {
          finish("canceled");
          return;
        }
        try {
          if (synth.paused) synth.resume();
          synth.speak(utterance);
          if (this.debugEnabled()) {
            console.log("[voice] speak() called", {
              speaking: synth.speaking,
              pending: synth.pending,
              paused: synth.paused,
              voice: utterance.voice?.name ?? "default",
            });
          }
        } catch {
          this.clearSpeechTimers();
          this.utterance = null;
          this.speakFinish = null;
          this.releaseUtterance(utterance);
          this.listeners.onError?.("synthesis-failure");
          reject(new Error("synthesis-failure"));
        }
      };

      // Chrome drops utterances if speak() runs in the same tick as cancel().
      if (synth.speaking || synth.pending) {
        try {
          synth.cancel();
        } catch {
          // Ignore.
        }
        window.setTimeout(start, 80);
      } else {
        start();
      }

      window.setTimeout(() => {
        if (settled) return;
        if (heard) return;
        finish("silent");
      }, 3000);
    });
  }

  private startIdleAmplitude() {
    this.stopIdleAmplitude();
    const startedAt = performance.now();
    const tick = (now: number) => {
      if (!this.listening) return;
      const t = (now - startedAt) / 1000;
      this.listeners.onAmplitude?.(0.22 + 0.18 * Math.sin(t * 2.1) + 0.07 * Math.sin(t * 5.4));
      this.rafId = window.requestAnimationFrame(tick);
    };
    this.rafId = window.requestAnimationFrame(tick);
  }

  private stopIdleAmplitude() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    this.listeners.onAmplitude?.(0);
  }
}

export function createBrowserVoiceProvider(listeners?: VoiceProviderListeners) {
  return new BrowserVoiceProvider(listeners);
}
