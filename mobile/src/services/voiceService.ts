import * as Speech from 'expo-speech';

export interface VoiceInteractionResult {
  recognizedText: string;
  characterReply: string;
  animationState: 'TALKING' | 'HAPPY' | 'SURPRISED' | 'SLEEPING';
  speechDurationMs: number;
}

/**
 * Voice Service with Real Text-to-Speech (TTS) via expo-speech
 * Supports English (en-US / en-IN), Hindi (hi-IN), and Gujarati (gu-IN)
 * Features:
 * - Real voice playback through device speaker
 * - Slower speaking rate & higher pitch tailored for children aged 3–5
 * - Animation callbacks (character mouth syncs to speech)
 */
export class VoiceService {
  private static isSpeaking = false;

  public static async requestPermission(): Promise<boolean> {
    return true;
  }

  public static async startRecording(): Promise<boolean> {
    // If character was speaking, stop it immediately when child starts talking
    this.stopSpeaking();
    return true;
  }

  public static async stopRecording(): Promise<string | null> {
    return 'captured-speech-audio';
  }

  /**
   * Real Voice Playback: Speaks the text out loud using device TTS engine
   */
  public static speakOutLoud(
    text: string,
    language: string = 'en',
    onStart?: () => void,
    onDone?: () => void
  ): void {
    try {
      Speech.stop();

      const langCode =
        language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-IN';

      this.isSpeaking = true;

      Speech.speak(text, {
        language: langCode,
        pitch: 1.15, // Friendly, playful, higher pitch for child companion
        rate: 0.88,  // Gentle, slower cadence for 3–5 year olds
        onStart: () => {
          this.isSpeaking = true;
          onStart?.();
        },
        onDone: () => {
          this.isSpeaking = false;
          onDone?.();
        },
        onStopped: () => {
          this.isSpeaking = false;
          onDone?.();
        },
        onError: (err) => {
          console.warn('TTS playback error, continuing with visual animation:', err);
          this.isSpeaking = false;
          onDone?.();
        },
      });
    } catch (e) {
      console.warn('Speech engine invocation error:', e);
      onDone?.();
    }
  }

  public static stopSpeaking(): void {
    try {
      Speech.stop();
      this.isSpeaking = false;
    } catch {}
  }

  public static async processVoice(
    audioUri: string | null,
    characterId: string,
    language: string,
    childNickname: string
  ): Promise<VoiceInteractionResult> {
    const responses: Record<string, Record<string, { recognized: string; reply: string }>> = {
      en: {
        dino: {
          recognized: 'Tell me about dinosaurs!',
          reply: `Roar! Did you know birds are tiny dinosaur relatives? Let's flap our wings like a pterodactyl!`,
        },
        robo: {
          recognized: 'Can we count numbers?',
          reply: `Beep boop! Let's count to 5 together! 1, 2, 3, 4, 5! You are super smart!`,
        },
        bunny: {
          recognized: 'Can you sing a song?',
          reply: `Hop hop! Twinkle twinkle little star, how I wonder what you are! High five!`,
        },
      },
      hi: {
        dino: {
          recognized: 'डायनासोर के बारे में बताओ!',
          reply: `दहाड़! डायनासोर बहुत बड़े और ताक़तवर होते थे! चलो मिलकर दहाड़ लगाएं: दहाड़!`,
        },
        robo: {
          recognized: 'गिनती सिखाओ!',
          reply: `बीप बूप! चलो साथ में गिनते हैं: एक, दो, तीन, चार, पाँच! शाबाश!`,
        },
        bunny: {
          recognized: 'मुझे कविता सुनाओ!',
          reply: `तितली उड़ी बस पर चढ़ी, सीट ना मिली तो रोने लगी! तुम बहुत प्यारे हो!`,
        },
      },
      gu: {
        dino: {
          recognized: 'ડાયનાસોર વિશે કહો!',
          reply: `ગર્જના! ડાયનાસોર બહુ મોટા અને મજબૂત હતા! ચાલો સાથે બોલીએ: ગર્જના!`,
        },
        robo: {
          recognized: 'ચાલો ગણતરી કરીએ!',
          reply: `બીપ બૂપ! ચાલો સાથે ગણીએ: એક, બે, ત્રણ, ચાર, પાંચ! બહુ સરસ!`,
        },
        bunny: {
          recognized: 'બાળગીત ગાવો!',
          reply: `ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહીં? ચાલો સાથે રમીએ!`,
        },
      },
    };

    const charMap = responses[language] || responses.en;
    const match = charMap[characterId] || charMap.dino;

    const wordCount = match.reply.split(/\s+/).length;
    const estimatedDurationMs = Math.max(3000, wordCount * 220);

    return {
      recognizedText: match.recognized,
      characterReply: match.reply,
      animationState: 'TALKING',
      speechDurationMs: estimatedDurationMs,
    };
  }
}
