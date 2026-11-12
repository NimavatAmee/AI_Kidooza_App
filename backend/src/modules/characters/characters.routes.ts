import { Router, Request, Response } from 'express';

export const charactersRouter = Router();

const DEFAULT_CHARACTERS = [
  {
    id: 'dino',
    name: 'Dino',
    personality: 'Curious, funny and energetic',
    topics: 'Animals, nature and simple questions',
    primaryColor: '#4CAF50',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
    isActive: true,
  },
  {
    id: 'robo',
    name: 'Robo',
    personality: 'Smart, friendly and helpful',
    topics: 'Numbers, colours, shapes and basic concepts',
    primaryColor: '#42A5F5',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
    isActive: true,
  },
  {
    id: 'bunny',
    name: 'Bunny',
    personality: 'Gentle, caring and playful',
    topics: 'Simple stories, rhymes and everyday activities',
    primaryColor: '#F06292',
    supportedStates: ['IDLE', 'LISTENING', 'THINKING', 'TALKING', 'HAPPY', 'SURPRISED', 'SLEEPING'],
    isActive: true,
  },
];

// GET /api/characters
charactersRouter.get('/', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: DEFAULT_CHARACTERS,
  });
});
