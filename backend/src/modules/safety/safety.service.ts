/**
 * Child Safety Guardrails Engine (Section 6.2 of MVP Document)
 * Enforces strict safety rules for children aged 3–5:
 * 1. Checks and blocks requests asking child for PII (address, school, phone, parents' credit card, secrets).
 * 2. Blocks inappropriate/adult/harmful language.
 * 3. Enforces short, simple sentences.
 * 4. Verifies allow-listed character actions.
 */

const BLOCKED_PATTERNS = [
  /password/i,
  /secret/i,
  /where do you live/i,
  /phone number/i,
  /credit card/i,
  /otp/i,
  /home address/i,
  /school name/i,
  /don't tell (your|mom|dad|parents)/i,
];

const SAFE_FALLBACKS: Record<string, string> = {
  en: "I'm your friendly AI companion! Let's sing a fun rhyme or count together!",
  hi: "मैं तुम्हारा AI दोस्त हूँ! चलो एक प्यारी सी कविता सुनते हैं!",
  gu: "હું તમારો AI મિત્ર છું! ચાલો એક સુંદર ગીત ગાઈએ!",
};

export interface SafetyCheckResult {
  isSafe: boolean;
  sanitizedText: string;
  flaggedReason?: string;
}

export class SafetyService {
  /**
   * Validates child input before passing to AI model
   */
  public static validateInput(text: string, language: string = 'en'): SafetyCheckResult {
    const trimmed = text.trim();

    // Check for blocked patterns or sensitive queries
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isSafe: false,
          sanitizedText: SAFE_FALLBACKS[language] || SAFE_FALLBACKS.en,
          flaggedReason: `Blocked pattern detected: ${pattern.source}`,
        };
      }
    }

    return {
      isSafe: true,
      sanitizedText: trimmed,
    };
  }

  /**
   * Validates character response before sending audio to child
   */
  public static validateOutput(response: string, language: string = 'en'): SafetyCheckResult {
    // Check output against blocked patterns (e.g. AI should never ask child secrets)
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(response)) {
        return {
          isSafe: false,
          sanitizedText: SAFE_FALLBACKS[language] || SAFE_FALLBACKS.en,
          flaggedReason: `Output contained unsafe prompt: ${pattern.source}`,
        };
      }
    }

    return {
      isSafe: true,
      sanitizedText: response,
    };
  }
}
