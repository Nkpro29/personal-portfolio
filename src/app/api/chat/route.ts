import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { chatRequestSchema } from "@/lib/validations";
import { retrieveRelevantKnowledge } from "@/lib/knowledge";
import {
  buildUserPrompt,
  getGeminiModel,
  localFallbackAnswer,
} from "@/lib/gemini";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function persistMessage(
  sessionToken: string,
  role: "user" | "assistant",
  content: string,
) {
  if (!isDatabaseConfigured()) return;

  try {
    const session = await prisma.chatSession.upsert({
      where: { sessionToken },
      create: { sessionToken },
      update: {},
    });

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role,
        content,
      },
    });
  } catch {
    // Persistence is best-effort; answering still succeeds.
  }
}

async function loadHistory(sessionToken: string) {
  if (!isDatabaseConfigured()) return [];

  try {
    const session = await prisma.chatSession.findUnique({
      where: { sessionToken },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 12,
        },
      },
    });

    return (session?.messages ?? []).map((message) => ({
      role: message.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: message.content }],
    }));
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Enter a question about Naman's work." }, { status: 400 });
  }

  const sessionToken = parsed.data.sessionToken || randomUUID();
  const question = parsed.data.message;
  const { items, offTopic } = await retrieveRelevantKnowledge(question);
  const prompt = buildUserPrompt(question, items);

  await persistMessage(sessionToken, "user", question);

  const model = getGeminiModel();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));
      let full = "";

      try {
        if (!model) {
          full = localFallbackAnswer(question, items, offTopic);
          send(full);
        } else {
          const history = await loadHistory(sessionToken);
          const result = await model.generateContentStream({
            contents: [
              ...history.slice(0, -1),
              { role: "user", parts: [{ text: prompt }] },
            ],
          });

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (!text) continue;
            full += text;
            send(text);
          }

          if (!full.trim()) {
            full = localFallbackAnswer(question, items, offTopic);
            send(full);
          }
        }
      } catch {
        full = localFallbackAnswer(question, items, offTopic);
        if (full) send(full);
      }

      await persistMessage(sessionToken, "assistant", full);
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Session-Token": sessionToken,
    },
  });
}
