"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ProjectItem } from "@/lib/portfolio";

export function ProjectArchitecture({
  project,
  onClose,
}: {
  project: ProjectItem | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!project) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, project]);

  if (!mounted || !project) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-bg/70 p-4 backdrop-blur-md sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="architecture-title"
        className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-[0_0_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
              System
            </p>
            <h3 id="architecture-title" className="display mt-2 text-3xl">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line p-2 text-ink-muted"
            aria-label="Close architecture"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-8">
          {project.architecture.map((node, index) => (
            <div key={node.label} className="flex flex-col items-center">
              <div className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3">
                <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">
                  {node.label}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{node.detail}</p>
              </div>
              {index < project.architecture.length - 1 && (
                <div className="h-6 w-px bg-line-strong" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
