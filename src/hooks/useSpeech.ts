import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types/place';

const LANG_CODES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: Language) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODES[lang];
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback((text: string, lang: Language) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  }, [isSpeaking, speak, stop]);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  return { isSpeaking, toggle, stop };
}
