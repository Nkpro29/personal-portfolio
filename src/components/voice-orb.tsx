"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import type { VoiceState } from "@/lib/voice";

export function VoiceOrb({
  state,
  amplitude,
  reduce,
}: {
  state: VoiceState;
  amplitude: MotionValue<number>;
  reduce: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const quiet = reduce || Boolean(prefersReduce);
  const scale = useTransform(amplitude, [0, 1], [1, quiet ? 1 : 1.16]);
  const glow = useTransform(amplitude, [0, 1], [0.22, quiet ? 0.22 : 0.62]);

  return (
    <motion.div
      aria-hidden
      className="relative mx-auto grid h-[7.25rem] w-[7.25rem] place-items-center rounded-full"
      animate={
        quiet
          ? { scale: 1 }
          : state === "speaking" || state === "listening"
            ? { scale: [1, 1.07, 1] }
            : state === "processing"
              ? { scale: [1, 1.03, 1] }
              : undefined
      }
      transition={
        quiet
          ? { duration: 0 }
          : {
              duration: state === "speaking" ? 1.8 : 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      <motion.span
        className="absolute inset-[-18%] rounded-full bg-accent/20 blur-2xl"
        style={{ opacity: glow }}
      />
      <motion.span
        className="absolute inset-0 rounded-full border border-accent/35"
        style={state === "listening" && !quiet ? { scale } : undefined}
      />
      <motion.span
        className={cn(
          "relative h-[4.6rem] w-[4.6rem] rounded-full",
          "bg-[radial-gradient(circle_at_35%_30%,rgba(238,241,246,0.55),rgba(125,206,196,0.18)_42%,rgba(13,15,19,0.92)_78%)]",
          "shadow-[0_0_40px_rgba(125,206,196,0.28)]",
        )}
        style={state === "listening" && !quiet ? { scale } : undefined}
      />
      <span
        className="absolute h-2 w-2 rounded-full bg-accent/90"
        style={{ opacity: state === "error" ? 0.35 : 0.9 }}
      />
    </motion.div>
  );
}
