import { speechRequestSchema } from "@/lib/validations";

export const runtime = "nodejs";

const GEMINI_TTS_MODEL = "gemini-3.1-flash-tts-preview";
const GEMINI_TTS_VOICE = "Kore";

function pcmToWavBuffer(pcm: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = speechRequestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Enter text to speak." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Speech synthesis is not configured." }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TTS_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model: GEMINI_TTS_MODEL,
          contents: [
            {
              parts: [
                {
                  text:
                    "Read the following portfolio assistant reply aloud in a calm, natural, professional voice. Do not add commentary.\n\n" +
                    parsed.data.text,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: GEMINI_TTS_VOICE,
                },
              },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      return Response.json({ error: "Speech synthesis request failed." }, { status: 502 });
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { data?: string };
          }>;
        };
      }>;
    };

    const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return Response.json({ error: "Speech synthesis returned no audio." }, { status: 502 });
    }

    const pcm = Buffer.from(base64Audio, "base64");
    const wav = pcmToWavBuffer(pcm);

    return new Response(wav, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "Speech synthesis failed." }, { status: 502 });
  }
}
