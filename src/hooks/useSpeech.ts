import { useState, useCallback, useRef, useEffect } from 'react';
import type { Language } from '@/types/place';

const LANG_CODES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // First try exact match
  let voice = voices.find(v => v.lang === lang);
  if (voice) return voice;
  
  // Then try language prefix
  const langPrefix = lang.split('-')[0];
  voice = voices.find(v => v.lang.startsWith(langPrefix));
  if (voice) return voice;
  
  // Fallback to any English voice
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Timeout in case voices don't load
    const timeout = setTimeout(() => setVoicesLoaded(true), 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  const speak = useCallback((text: string, lang: Language) => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the desired language
    utterance.lang = LANG_CODES[lang];
    
    // Try to find the best voice
    if (voicesLoaded) {
      const voice = getBestVoice(LANG_CODES[lang]);
      if (voice) {
        utterance.voice = voice;
        // Keep the voice's lang if it's better
        utterance.lang = voice.lang;
      }
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
      if (e.error === 'not-allowed') {
        alert('Speech synthesis is blocked. Please allow microphone/speech permissions.');
      }
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voicesLoaded]);

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
    return () => { 
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); 
      }
    };
  }, []);

  return { isSpeaking, toggle, stop, voicesLoaded };
}
