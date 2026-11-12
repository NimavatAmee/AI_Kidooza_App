/**
 * Character animation states per Section 6.1 of MVP Specification:
 * - IDLE: Neutral breathing, blinking
 * - LISTENING: Ear perked, attentiveness when child speaks
 * - THINKING: Processing speech or waiting for AI response
 * - TALKING: Mouth/body movement synced to spoken TTS audio
 * - HAPPY: Cheerful jumping or celebrating
 * - SURPRISED: Wide eyes, excited reaction
 * - SLEEPING: Resting state when inactive or bedtime
 */
export type CharacterState = 
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'TALKING'
  | 'HAPPY'
  | 'SURPRISED'
  | 'SLEEPING';

export type CharacterId = 'dino' | 'robo' | 'bunny';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  personality: string;
  primaryColor: string;
  secondaryColor: string;
  supportedStates: CharacterState[];
}

export const DINO_CHARACTER: CharacterConfig = {
  id: 'dino',
  name: 'Dino',
  personality: 'Curious, funny and energetic',
  primaryColor: '#4CAF50', // Friendly kid-safe green
  secondaryColor: '#FFEB3B', // Soft yellow belly
  supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
};
