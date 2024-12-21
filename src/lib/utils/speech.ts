import { toast } from 'react-hot-toast';

interface VoicePreference {
  gender: 'male' | 'female';
}

class NewsReaderService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private isPaused = false;
  private voicesLoaded = false;
  private voicePreference: VoicePreference = { gender: 'female' };

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
      };
    }
  }

  setVoicePreference(preference: VoicePreference) {
    this.voicePreference = preference;
  }

  private getNewsReaderVoice(): SpeechSynthesisVoice | null {
    const voices = this.synthesis.getVoices();
    const isFemalePref = this.voicePreference.gender === 'female';
    
    // Helper to detect voice gender
    const isFemaleVoice = (name: string) => 
      name.toLowerCase().includes('female') || 
      name.toLowerCase().includes('woman') ||
      /\b(samantha|victoria|karen|susan|lisa|amy)\b/i.test(name);
    
    // First try to find a natural voice matching gender preference
    let voice = voices.find(voice => 
      voice.lang === 'en-US' && 
      voice.localService &&
      voice.name.toLowerCase().includes('natural') &&
      isFemaleVoice(voice.name) === isFemalePref
    );

    // Then try any US voice matching gender preference
    if (!voice) {
      voice = voices.find(voice => 
        voice.lang === 'en-US' && 
        isFemaleVoice(voice.name) === isFemalePref
      );
    }

    // Fall back to any US voice
    if (!voice) {
      voice = voices.find(voice => voice.lang === 'en-US');
    }

    // Last resort: any English voice
    if (!voice) {
      voice = voices.find(voice => voice.lang.startsWith('en-'));
    }

    return voice || voices[0];
  }

  private formatNewsText(text: string): string {
    return text
      .replace(/([.!?])\s+/g, '$1... ') // Add pause after sentences
      .replace(/([:-])\s+/g, '$1... ') // Add pause after colons and dashes
      .replace(/(\d{4})/g, '$1... ') // Add pause after years
      .trim();
  }

  async speak(text: string, isHeadline = false): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.stop();

        if (!this.voicesLoaded && this.synthesis.onvoiceschanged !== undefined) {
          setTimeout(() => this.speak(text, isHeadline).then(resolve).catch(reject), 100);
          return;
        }

        const formattedText = this.formatNewsText(text);
        this.utterance = new SpeechSynthesisUtterance(formattedText);
        
        // Optimize voice settings for news reading
        this.utterance.rate = isHeadline ? 0.9 : 0.95; // Slightly slower for headlines
        this.utterance.pitch = this.voicePreference.gender === 'female' ? 1.1 : 1.0;
        this.utterance.volume = 1.0;

        const newsReaderVoice = this.getNewsReaderVoice();
        if (newsReaderVoice) {
          this.utterance.voice = newsReaderVoice;
        }

        this.utterance.onend = () => {
          this.isPlaying = false;
          this.isPaused = false;
          resolve();
        };

        this.utterance.onerror = (event) => {
          if (event.error !== 'interrupted') {
            console.error('News reader error:', event);
            toast.error('Unable to read the news at this moment');
          }
          this.isPlaying = false;
          this.isPaused = false;
          reject(new Error(event.error));
        };

        this.synthesis.speak(this.utterance);
        this.isPlaying = true;
        this.isPaused = false;

        // Fix Chrome speech synthesis bug
        if (this.synthesis.paused) {
          this.synthesis.resume();
        }
      } catch (error) {
        console.error('News reader error:', error);
        toast.error('News reading is not available in your browser');
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.isPaused = false;
    }
  }

  pause(): void {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.pause();
      this.isPaused = true;
    }
  }

  resume(): void {
    if (this.synthesis && this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
    }
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
}

export const newsReader = new NewsReaderService();