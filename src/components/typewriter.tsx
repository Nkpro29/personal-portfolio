"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function Typewriter({
  phrases,
  className,
}: {
  phrases: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? phrases[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const current = phrases[index];
    const doneTyping = text === current && !deleting;
    const doneDeleting = deleting && text.length === 0;

    const delay = doneTyping
      ? 1800
      : doneDeleting
        ? 380
        : deleting
          ? 28
          : 42 + Math.random() * 28;

    const timer = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }
      if (doneDeleting) {
        setDeleting(false);
        setIndex((value) => (value + 1) % phrases.length);
        return;
      }
      const nextLength = deleting ? text.length - 1 : text.length + 1;
      setText(current.slice(0, nextLength));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, index, phrases, reduce, text]);

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[1px] translate-y-[0.12em] bg-accent align-middle" />
    </span>
  );
}
