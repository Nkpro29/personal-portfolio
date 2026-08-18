export type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error";

export type VoiceErrorCode =
  | "unsupported"
  | "permission-denied"
  | "microphone-unavailable"
  | "recognition-failure"
  | "network-failure"
  | "synthesis-failure";

export type SpeakOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
};

export const DEFAULT_SPEAK_OPTIONS: Required<SpeakOptions> = {
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: "en-US",
};

export type VoiceProviderListeners = {
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onAmplitude?: (value: number) => void;
  onSpeakEnd?: (reason: "completed" | "canceled") => void;
  onError?: (code: VoiceErrorCode) => void;
};

/**
 * Swap this implementation later for Gemini Live, Deepgram, ElevenLabs, etc.
 * The Ask Naman UI should only depend on this surface.
 */
export interface VoiceProvider {
  readonly id: string;
  isSupported(): boolean;
  /** Prepare audio on a user gesture so later TTS/mic work on iOS. */
  unlock(): void;
  startListening(): Promise<void>;
  stopListening(): void;
  speak(text: string, options?: SpeakOptions): Promise<"played" | "silent" | "canceled">;
  stopSpeaking(): void;
  dispose(): void;
}

export type VoiceProviderFactory = (listeners: VoiceProviderListeners) => VoiceProvider;
