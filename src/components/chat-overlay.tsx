"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

export function ChatOverlay({
  turns,
  pending,
  reduce,
  onClose,
  composer,
}: {
  turns: ChatTurn[];
  pending: boolean;
  reduce: boolean;
  onClose: () => void;
  composer: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-bg/55 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-naman-title"
        tabIndex={-1}
        className="flex h-[92svh] w-full max-w-2xl flex-col border-t border-line bg-surface/90 sm:h-[min(72vh,720px)] sm:rounded-2xl sm:border"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p id="ask-naman-title" className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
              Ask Naman
            </p>
            <p className="mt-1 text-sm text-ink-muted">Portfolio command interface</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs tracking-[0.16em] text-ink-faint uppercase"
          >
            Close
          </button>
        </div>

        <div ref={scrollerRef} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6">
          {turns.map((turn) => (
            <div key={turn.id} className="max-w-xl">
              <p className="font-mono text-[10px] tracking-[0.22em] text-ink-faint uppercase">
                {turn.role === "user" ? "You" : "Naman / AI"}
              </p>
              <p className="mt-2 text-[15px] leading-7 text-ink-soft">
                {turn.content || (turn.streaming ? "" : "…")}
                {turn.streaming && !turn.content && <TypingDots />}
                {turn.streaming && turn.content && (
                  <span className="ml-0.5 inline-block h-4 w-[1px] translate-y-[2px] bg-accent" />
                )}
              </p>
            </div>
          ))}
          {pending && turns.at(-1)?.content && (
            <p className="font-mono text-[10px] tracking-[0.2em] text-ink-faint uppercase">
              Streaming
            </p>
          )}
        </div>

        <div className="border-t border-line p-4">{composer}</div>
      </motion.div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Thinking">
      <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
      <span className="h-1 w-1 animate-pulse rounded-full bg-accent [animation-delay:120ms]" />
      <span className="h-1 w-1 animate-pulse rounded-full bg-accent [animation-delay:240ms]" />
    </span>
  );
}
