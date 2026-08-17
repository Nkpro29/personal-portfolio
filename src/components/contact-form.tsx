"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/actions/contact";

const initial: ContactState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-ok/30 bg-ok/8 p-8">
        <p className="text-lg text-ok">{state.message}</p>
        <p className="mt-2 text-sm text-ink-muted">
          Thanks for writing. The note is stored privately.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          error={state.fieldErrors?.name}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          error={state.fieldErrors?.email}
        />
        <Field label="Company" name="company" error={state.fieldErrors?.company} />
        <Field
          label="What are you looking to build?"
          name="lookingToBuild"
          required
          error={state.fieldErrors?.lookingToBuild}
        />
      </div>
      <label className="mt-5 block">
        <span className="mb-2 block text-xs tracking-[0.16em] text-ink-faint uppercase">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink outline-none focus:border-accent/50"
        />
        {state.fieldErrors?.message && (
          <span className="mt-1 block text-xs text-danger">{state.fieldErrors.message}</span>
        )}
      </label>
      {state.status === "error" && (
        <p className="mt-4 text-sm text-danger">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm text-accent disabled:opacity-60"
      >
        {pending ? "Sending…" : "Start a conversation"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.16em] text-ink-faint uppercase">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink outline-none focus:border-accent/50"
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
