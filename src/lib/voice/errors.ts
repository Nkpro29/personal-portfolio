import type { VoiceErrorCode } from "@/lib/voice/types";

export function voiceErrorMessage(code: VoiceErrorCode) {
  switch (code) {
    case "unsupported":
      return "Voice input isn't supported in this browser. You can still ask Naman anything using text.";
    case "permission-denied":
      return "Microphone access is required for voice mode.";
    case "microphone-unavailable":
      return "A microphone wasn't found. You can still ask Naman using text.";
    case "recognition-failure":
      return "I couldn't catch that. Try speaking again, or type your question.";
    case "network-failure":
      return "The assistant is temporarily unavailable. You can still ask Naman using text.";
    case "synthesis-failure":
      return "I couldn't play the spoken reply. The answer is still in the chat.";
  }
}

export function recognitionErrorCode(error: string): VoiceErrorCode | "ignored" | "no-speech" {
  switch (error) {
    case "aborted":
      return "ignored";
    case "no-speech":
      return "no-speech";
    case "not-allowed":
    case "service-not-allowed":
      return "permission-denied";
    case "audio-capture":
      return "microphone-unavailable";
    case "network":
      return "network-failure";
    default:
      return "recognition-failure";
  }
}

export function mediaErrorCode(error: unknown): VoiceErrorCode {
  const name =
    error && typeof error === "object" && "name" in error
      ? String((error as { name: string }).name)
      : "";

  if (name === "NotAllowedError" || name === "SecurityError") {
    return "permission-denied";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") {
    return "microphone-unavailable";
  }
  return "microphone-unavailable";
}
