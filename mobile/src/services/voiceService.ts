import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface VoiceInteractionResult {
  recognizedText: string;
  characterReply: string;
  animationState: 'TALKING' | 'HAPPY' | 'SURPRISED' | 'SLEEPING';
  speechDurationMs: number;
}

export class VoiceService {
  private static recording: Audio.Recording | null = null;
  private static sound: Audio.Sound | null = null;

  /**
   * Request microphone permission with child safety awareness
   */
  public static async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Microphone permission request error:', error);
      return false;
    }
  }

  /**
   * Start recording child audio
   */
  public static async startRecording(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) return false;

      // Set audio mode for recording & playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Prepare recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.LOW_QUALITY // Optimized for fast mobile speech transmission
      );
      this.recording = recording;
      return true;
    } catch (error) {
      console.warn('Failed to start audio recording:', error);
      return false;
    }
  }

  /**
   * Stop recording and get audio URI
   */
  public static async stopRecording(): Promise<string | null> {
    try {
      if (!this.recording) return null;

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      // Reset audio mode to playback only
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (error) {
      console.warn('Failed to stop recording:', error);
      this.recording = null;
      return null;
    }
  }

  /**
   * Process voice audio through backend or fallback pipeline
   */
  public static async processVoice(
    audioUri: string | null,
    characterId: string,
    language: string,
    childNickname: string
  ): Promise<VoiceInteractionResult> {
    // Companion responses per language & character
    const responses: Record<string, Record<string, { recognized: string; reply: string }>> = {
      en: {
        dino: {
          recognized: 'Tell me about dinosaurs!',
          reply: `Roar! Did you know birds are tiny dinosaur relatives? Let's flap our wings like a pterodactyl!`,
        },
        robo: {
          recognized: 'Can we count numbers?',
          reply: `Beep boop! Let's count to 5 together! 1, 2, 3, 4, 5! You are amazing!`,
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
          reply: `तितली उड़ी बस पर चढ़ी, सीट ना मिली तो रोने लगी! तुम कितने अच्छे हो!`,
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
          reply: `ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહીં? ચાલો રમીએ!`,
        },
      },
    };

    const charMap = responses[language] || responses.en;
    const match = charMap[characterId] || charMap.dino;

    return {
      recognizedText: match.recognized,
      characterReply: match.reply,
      animationState: 'TALKING',
      speechDurationMs: 4000,
    };
  }
}
