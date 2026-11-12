/**
 * AI Companion Persona Engine (Section 3 & Section 6.2 of MVP Document)
 * Generates age-appropriate (Ages 3–5) companion responses based on:
 * - Selected Character (Dino, Robo, Bunny)
 * - Preferred Language (en, hi, gu)
 * - Strict Child Safety rules (short sentences, safe actions, virtual persona)
 */

export interface CompanionReply {
  text: string;
  animationState: 'TALKING' | 'HAPPY' | 'SURPRISED' | 'SLEEPING';
  allowlistedAction?: string;
}

export class AiService {
  public static async generateResponse(
    childInput: string,
    characterId: string,
    language: string = 'en',
    childNickname: string = 'friend'
  ): Promise<CompanionReply> {
    // 1. Character-specific Persona Responses
    if (characterId === 'dino') {
      if (language === 'hi') {
        return {
          text: `दहाड़! मैं डायनो हूँ! क्या तुम्हें पता है कि डायनासोर बहुत ऊँचे पेड़ के पत्ते खाते थे? चलो जंगल में घूमें!`,
          animationState: 'HAPPY',
          allowlistedAction: 'roar',
        };
      }
      if (language === 'gu') {
        return {
          text: `ગર્જના! હું ડાયનો છું! શું તમને ખબર છે કે ડાયનાસોર બહુ ઊંચા ઝાડના પાંદડા ખાતા હતા? ચાલો જંગલમાં રમીએ!`,
          animationState: 'HAPPY',
          allowlistedAction: 'roar',
        };
      }
      return {
        text: `Roar! I'm Dino! Did you know some dinosaurs were as tall as big tall trees? Let's explore together!`,
        animationState: 'HAPPY',
        allowlistedAction: 'roar',
      };
    }

    if (characterId === 'robo') {
      if (language === 'hi') {
        return {
          text: `बीप बूप! नमस्ते ${childNickname}! चलो मिलकर 1, 2, 3 गिनते हैं! 1 तारा, 2 तारे, 3 तारे! शाबाश!`,
          animationState: 'TALKING',
          allowlistedAction: 'beep',
        };
      }
      if (language === 'gu') {
        return {
          text: `બીપ બૂપ! નમસ્તે ${childNickname}! ચાલો આપણે 1, 2, 3 ગણીએ! 1 તારો, 2 તારા, 3 તારા! બહુ સરસ!`,
          animationState: 'TALKING',
          allowlistedAction: 'beep',
        };
      }
      return {
        text: `Beep boop! Hello ${childNickname}! Let's count to 5 together! 1, 2, 3, 4, 5! You are super smart!`,
        animationState: 'TALKING',
        allowlistedAction: 'beep',
      };
    }

    // Bunny persona
    if (language === 'hi') {
      return {
        text: `नमस्ते प्यारी ${childNickname}! मेरे बड़े-बड़े कान तुम्हारी हर बात सुनते हैं! चलो एक प्यारी सी लोरी गाते हैं!`,
        animationState: 'HAPPY',
        allowlistedAction: 'hop',
      };
    }
    if (language === 'gu') {
      return {
        text: `નમસ્તે વ્હાલા ${childNickname}! મારા લાંબા કાન તમારી બધી વાતો સાંભળે છે! ચાલો સુંદર ગીત ગાઈએ!`,
        animationState: 'HAPPY',
        allowlistedAction: 'hop',
      };
    }
    return {
      text: `Hello ${childNickname}! My fluffy bunny ears love listening to you! Let's sing a happy rhyme together!`,
      animationState: 'HAPPY',
      allowlistedAction: 'hop',
    };
  }
}
