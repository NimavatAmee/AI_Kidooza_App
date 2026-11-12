/**
 * Speech-to-Text (STT) Service
 * Supports English, Hindi (hi), and Gujarati (gu).
 * - Transcribes speech while ensuring no raw audio is permanently stored (DPDP Act compliance).
 */

export interface TranscriptionResult {
  text: string;
  confidence: number;
  detectedLanguage: string;
}

export class SttService {
  /**
   * Transcribes an uploaded audio buffer or file
   */
  public static async transcribeAudio(
    audioBuffer: Buffer,
    targetLanguage: string = 'en'
  ): Promise<TranscriptionResult> {
    // For local development & testing without requiring paid third-party API keys:
    // We provide realistic multilingual companion prompts
    const mockTranscriptions: Record<string, string[]> = {
      en: [
        'Can you tell me an animal fact?',
        'What sound does a dinosaur make?',
        'Can you sing a nursery rhyme with me?',
        'How many stars are in the sky?',
      ],
      hi: [
        'मुझे एक प्यारी सी कहानी सुनाओ!',
        'शेर कैसे दहाड़ता है?',
        'तितली वाली कविता सुनाओ ना!',
        'आसमान का रंग नीला क्यों होता है?',
      ],
      gu: [
        'મને એક સરસ વાર્તા કહો!',
        'સિંહ કેવી રીતે ગર્જના કરે છે?',
        'ચાલો સાથે એક બાળગીત ગાઈએ!',
        'તમે ક્યાં રહો છો?',
      ],
    };

    const options = mockTranscriptions[targetLanguage] || mockTranscriptions.en;
    const randomText = options[Math.floor(Math.random() * options.length)];

    return {
      text: randomText,
      confidence: 0.96,
      detectedLanguage: targetLanguage,
    };
  }
}
