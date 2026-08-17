"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = "button",
}: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const classNames = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm tracking-wide transition-colors",
    className,
  );

  function onMove(event: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.28);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={classNames}
        style={{ x: springX, y: springY }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classNames}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
