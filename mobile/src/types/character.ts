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

export type AppLanguage = 'en' | 'hi' | 'gu';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  personality: string;
  topics: string;
  primaryColor: string;
  badgeEmoji: string;
  supportedStates: CharacterState[];
}

export const CHARACTERS: Record<CharacterId, CharacterConfig> = {
  dino: {
    id: 'dino',
    name: 'Dino',
    personality: 'Curious, funny and energetic',
    topics: 'Animals, nature and simple questions',
    primaryColor: '#4CAF50',
    badgeEmoji: '🦖',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
  },
  robo: {
    id: 'robo',
    name: 'Robo',
    personality: 'Smart, friendly and helpful',
    topics: 'Numbers, colours, shapes and basic concepts',
    primaryColor: '#42A5F5',
    badgeEmoji: '🤖',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
  },
  bunny: {
    id: 'bunny',
    name: 'Bunny',
    personality: 'Gentle, caring and playful',
    topics: 'Simple stories, rhymes and everyday activities',
    primaryColor: '#F06292',
    badgeEmoji: '🐰',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
  },
};

export const DINO_CHARACTER = CHARACTERS.dino;
