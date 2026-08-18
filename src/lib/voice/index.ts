export {
  DEFAULT_SPEAK_OPTIONS,
  type SpeakOptions,
  type VoiceErrorCode,
  type VoiceProvider,
  type VoiceProviderFactory,
  type VoiceProviderListeners,
  type VoiceState,
} from "@/lib/voice/types";
export { voiceErrorMessage } from "@/lib/voice/errors";
export {
  BrowserVoiceProvider,
  createBrowserVoiceProvider,
  isBrowserVoiceSupported,
} from "@/lib/voice/browser-provider";
