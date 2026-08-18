"use client";

import type { MotionValue } from "framer-motion";
import { VoiceOrb } from "@/components/voice-orb";
import type { VoiceState } from "@/lib/voice";

const STATUS: Record<VoiceState, string> = {
  idle: "Ready",
  listening: "Listening",
  processing: "Thinking",
  speaking: "Speaking",
  error: "Something went wrong",
};

export function VoiceSession({
  state,
  interimTranscript,
  errorMessage,
  amplitude,
  reduce,
  onStopListening,
  onEnd,
  onRetry,
}: {
  state: VoiceState;
  interimTranscript: string;
  errorMessage: string | null;
  amplitude: MotionValue<number>;
  reduce: boolean;
  onStopListening: () => void;
  onEnd: () => void;
  onRetry: () => void;
}) {
  const quote =
    state === "listening"
      ? interimTranscript || "Speak your question"
      : state === "processing"
        ? "Naman AI is thinking…"
        : errorMessage || "You can still ask Naman using text.";

  return (
    <div className="flex flex-col items-center px-2 pt-2 pb-1 text-center">
      <div role="status" aria-live="polite" className="sr-only">
        {STATUS[state]}
        {state === "listening" && interimTranscript ? `. ${interimTranscript}` : ""}
      </div>

      <VoiceOrb state={state} amplitude={amplitude} reduce={reduce} />

      <p className="mt-5 font-mono text-[11px] tracking-[0.22em] text-accent uppercase">{STATUS[state]}</p>

      <p
        className={
          state === "error"
            ? "mt-3 max-w-md text-sm leading-6 text-ink-muted"
            : "display mt-3 max-w-md line-clamp-5 break-words text-[1.15rem] leading-8 text-ink-soft"
        }
      >
        {state === "listening" ? `“${quote}”` : quote}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {state === "listening" && (
          <button
            type="button"
            onClick={onStopListening}
            aria-label="Stop listening"
            className="rounded-full border border-line-strong px-4 py-2 text-xs tracking-[0.16em] text-ink-soft uppercase"
          >
            Stop listening
          </button>
        )}
        {state === "error" && (
          <button
            type="button"
            onClick={onRetry}
            aria-label="Start voice conversation"
            className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs tracking-[0.16em] text-accent uppercase"
          >
            Try again
          </button>
        )}
        <button
          type="button"
          onClick={onEnd}
          aria-label="End conversation"
          className="rounded-full border border-line px-4 py-2 text-xs tracking-[0.16em] text-ink-faint uppercase"
        >
          End conversation
        </button>
      </div>
    </div>
  );
}
