"use server";

import { contactSchema } from "@/lib/validations";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") || "",
    lookingToBuild: formData.get("lookingToBuild"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message:
        "The contact inbox is not connected yet. Add DATABASE_URL to enable submissions, or reach Naman through the social links when they are configured.",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        lookingToBuild: parsed.data.lookingToBuild,
        message: parsed.data.message,
      },
    });

    return {
      status: "success",
      message: "Received. Naman will get back to you.",
    };
  } catch {
    return {
      status: "error",
      message: "Could not save the message. Please try again in a moment.",
    };
  }
}
