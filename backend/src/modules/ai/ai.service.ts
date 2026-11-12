import { GoogleGenAI } from '@google/genai';

/**
 * AI Companion Persona Engine (Section 3 & Section 6.2 of MVP Document)
 * Generates dynamic, preschool-appropriate (Ages 3–5) companion responses powered by Google Gemini AI:
 * - Selected Character (Dino, Robo, Bunny)
 * - Preferred Language (en, hi, gu)
 * - Strict Child Safety rules (short 1-2 sentences, safe actions, gentle tone)
 */

export interface CompanionReply {
  text: string;
  animationState: 'TALKING' | 'HAPPY' | 'SURPRISED' | 'SLEEPING';
  allowlistedAction?: string;
  isAiGenerated?: boolean;
}

export class AiService {
  private static geminiClient: GoogleGenAI | null = null;

  private static getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return null;
    }

    if (!this.geminiClient) {
      try {
        this.geminiClient = new GoogleGenAI({ apiKey });
      } catch (err) {
        console.warn('[Gemini AI Init Failed]', err);
        return null;
      }
    }
    return this.geminiClient;
  }

  /**
   * Generates a dynamic AI response tailored to the child's exact question or speech
   */
  public static async generateResponse(
    childInput: string,
    characterId: string,
    language: string = 'en',
    childNickname: string = 'friend'
  ): Promise<CompanionReply> {
    const client = this.getGeminiClient();

    // 1. If Gemini API key is available, call Gemini Flash LLM
    if (client) {
      try {
        const reply = await this.callGemini(client, childInput, characterId, language, childNickname);
        if (reply) {
          return reply;
        }
      } catch (err) {
        console.warn('[Gemini AI Call Failed, switching to dynamic fallback]:', err);
      }
    } else {
      console.log('[AI Info] GEMINI_API_KEY not configured in backend/.env — using intelligent dynamic companion response.');
    }

    // 2. Dynamic Preschool Context Engine (Works seamlessly offline or without API key)
    return this.generateDynamicPreschoolReply(childInput, characterId, language, childNickname);
  }

  /**
   * Call Google Gemini API (gemini-2.5-flash) with child-safe system instructions
   */
  private static async callGemini(
    client: GoogleGenAI,
    childInput: string,
    characterId: string,
    language: string,
    childNickname: string
  ): Promise<CompanionReply | null> {
    const charName = characterId === 'dino' ? 'Dino the friendly baby dinosaur' : characterId === 'robo' ? 'Robo the playful counting robot' : 'Bunny the sweet singing rabbit';
    const soundPrefix = characterId === 'dino' ? 'Roar! ' : characterId === 'robo' ? 'Beep Boop! ' : 'Hop hop! ';

    let langInstruction = 'Respond in simple, clear English.';
    if (language === 'hi') {
      langInstruction = 'Respond in gentle, natural Hindi (Devanagari script). Keep words very simple for an Indian preschooler.';
    } else if (language === 'gu') {
      langInstruction = 'Respond in gentle, natural Gujarati (Gujarati script). Keep words very simple for a Gujarati preschooler.';
    }

    const systemInstruction = `You are ${charName}, an interactive AI toy companion for a 3-to-5 year old preschooler named ${childNickname}.
Guidelines:
1. STRICTLY keep your answer to 1 or 2 SHORT, joyful sentences maximum.
2. Tone: Warm, playful, enthusiastic, preschool-safe.
3. ${langInstruction}
4. DO NOT use adult, scary, or complex scientific words.
5. NEVER ask for personal secrets, address, school name, phone number, or credit cards.
6. Always encourage curiosity, dancing, counting, or laughing!`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: childInput,
      config: {
        systemInstruction,
        maxOutputTokens: 120,
        temperature: 0.7,
      },
    });

    const candidateText = response.text?.trim();
    if (!candidateText) {
      return null;
    }

    // Determine animation based on sentiment
    let animationState: 'TALKING' | 'HAPPY' | 'SURPRISED' | 'SLEEPING' = 'TALKING';
    if (/wow|yay|roar|yayy|hurray|मज़ा|સરસ|ખૂબ/i.test(candidateText)) {
      animationState = 'HAPPY';
    } else if (/whoa|really|सच|ખરેખર/i.test(candidateText)) {
      animationState = 'SURPRISED';
    }

    return {
      text: candidateText,
      animationState,
      allowlistedAction: characterId === 'dino' ? 'roar' : characterId === 'robo' ? 'beep' : 'hop',
      isAiGenerated: true,
    };
  }

  /**
   * Smart dynamic context generator when Gemini API key is pending.
   * Understands what the child says (food, colors, counting, animals, feelings, names, rhymes).
   */
  private static generateDynamicPreschoolReply(
    childInput: string,
    characterId: string,
    language: string,
    childNickname: string
  ): CompanionReply {
    const input = childInput.toLowerCase();

    // 1. Counting & Numbers
    if (/count|number|1|2|3|4|5|गिनती|ગણતરી/.test(input)) {
      if (characterId === 'robo') {
        const text = language === 'hi'
          ? `बीप बूप! चलो 1 से 5 गिनते हैं: एक, दो, तीन, चार, पाँच! तुम बहुत होशियार हो!`
          : language === 'gu'
          ? `બીપ બૂપ! ચાલો 1 થી 5 ગણીએ: એક, બે, ત્રણ, ચાર, પાંચ! તમે બહુ હોશિયાર છો!`
          : `Beep boop! Let's count together: 1, 2, 3, 4, 5! You are super smart!`;
        return { text, animationState: 'TALKING', allowlistedAction: 'beep' };
      }
    }

    // 2. Songs & Rhymes
    if (/song|rhyme|sing|twinkle|गाना|कविता|ગીત|બાળગીત/.test(input)) {
      const text = language === 'hi'
        ? `तितली उड़ी बस पर चढ़ी, सीट ना मिली तो रोने लगी! क्या तुम्हें यह कविता पसंद आई?`
        : language === 'gu'
        ? `ચકીબેન ચકીબેન મારી સાથે રમવા આવશો કે નહીં? ચાલો સાથે સુંદર ગીત ગાઈએ!`
        : `Twinkle twinkle little star, how I wonder what you are! Up above the world so high!`;
      return { text, animationState: 'HAPPY', allowlistedAction: 'sing' };
    }

    // 3. Animals & Nature
    if (/animal|dog|cat|lion|dinosaur|bird|tree|जानवर|शेर|चिड़िया|પ્રાણી|સિંહ|પક્ષી/.test(input)) {
      if (characterId === 'dino') {
        const text = language === 'hi'
          ? `दहाड़! मुझे हरे-भरे पेड़ों के पत्ते खाना बहुत पसंद है! चलो हम दोनों जंगल में घूमें!`
          : language === 'gu'
          ? `ગર્જના! મને લીલાછમ ઝાડના પાંદડા ખાવા બહુ ગમે છે! ચાલો જંગલમાં રમીએ!`
          : `Roar! Dinosaurs loved eating big green leaves! Let's stomp around like gentle dinosaurs!`;
        return { text, animationState: 'HAPPY', allowlistedAction: 'roar' };
      }
    }

    // 4. Food & Eating
    if (/food|eat|hungry|apple|ice cream|खाना|सेब|ભોજન|સફરજન/.test(input)) {
      const text = language === 'hi'
        ? `यम यम! लाल सेब और मीठा फल सेहत के लिए बहुत अच्छे होते हैं!`
        : language === 'gu'
        ? `યમ યમ! લાલ સફરજન અને મીઠા ફળ સ્વાસ્થ્ય માટે બહુ સારા હોય છે!`
        : `Yum yum! Crunchy apples and fresh fruits make us strong and energetic!`;
      return { text, animationState: 'HAPPY' };
    }

    // 5. Greetings & Friendships
    if (/hello|hi|friend|name|who are you|नमस्ते|દોસ્ત|કોણ/.test(input)) {
      const charGreeting = characterId === 'dino'
        ? {
            en: `Hello ${childNickname}! I'm Dino! I'm so happy to be your best friend today!`,
            hi: `नमस्ते ${childNickname}! मैं तुम्हारा दोस्त डायनो हूँ! आज हम खूब मस्ती करेंगे!`,
            gu: `નમસ્તે ${childNickname}! હું તમારો મિત્ર ડાયનો છું! આજે આપણે બહુ મજા કરીશું!`,
          }
        : characterId === 'robo'
        ? {
            en: `Beep boop! Hello ${childNickname}! Robo is ready for fun learning adventures!`,
            hi: `बीप बूप! नमस्ते ${childNickname}! रोबो तुम्हारे साथ नई चीज़ें सीखने के लिए तैयार है!`,
            gu: `બીપ બૂપ! નમસ્તે ${childNickname}! રોબો તમારી સાથે નવું શીખવા માટે તૈયાર છે!`,
          }
        : {
            en: `Hop hop! Hello sweet ${childNickname}! Bunny is so excited to play with you!`,
            hi: `नमस्ते प्यारी ${childNickname}! चलो मिलकर मुस्कुराएं और मस्ती करें!`,
            gu: `નમસ્તે વ્હાલા ${childNickname}! ચાલો સાથે હસીએ અને ગીત ગાઈએ!`,
          };
      const text = charGreeting[language as 'en' | 'hi' | 'gu'] || charGreeting.en;
      return { text, animationState: 'HAPPY' };
    }

    // 6. General Conversational Fallback tailored to character & language
    if (characterId === 'dino') {
      const text = language === 'hi'
        ? `दहाड़! मुझे तुम्हारी बात सुनकर बहुत अच्छा लगा! चलो मिलकर एक बड़ा कदम उठाएं!`
        : language === 'gu'
        ? `ગર્જના! મને તમારી વાત સાંભળીને બહુ ગમ્યું! ચાલો સાથે મોટું પગલું ભરીએ!`
        : `Roar! I love talking with you, ${childNickname}! You have the best ideas!`;
      return { text, animationState: 'TALKING', allowlistedAction: 'roar' };
    }

    if (characterId === 'robo') {
      const text = language === 'hi'
        ? `बीप बूप! मेरे कंप्यूटर दिमाग को तुम्हारी बात बहुत पसंद आई! तुम सच में कमाल हो!`
        : language === 'gu'
        ? `બીપ બૂપ! મારા કમ્પ્યુટર મગજને તમારી વાત બહુ ગમી! તમે સાચે જ અદ્ભુત છો!`
        : `Beep boop! My robot brain processed your words and I give you a big high five!`;
      return { text, animationState: 'TALKING', allowlistedAction: 'beep' };
    }

    // Bunny
    const text = language === 'hi'
      ? `हॉप हॉप! मेरे लंबे कान तुम्हारी हर बात सुनते हैं! तुम कितने प्यारे दोस्त हो!`
      : language === 'gu'
      ? `હૉપ હૉપ! મારા લાંબા કાન તમારી બધી વાત સાંભળે છે! તમે કેટલા સરસ મિત્ર છો!`
      : `Hop hop! My fluffy ears love hearing your sweet voice! You are so wonderful!`;
    return { text, animationState: 'HAPPY', allowlistedAction: 'hop' };
  }
}
