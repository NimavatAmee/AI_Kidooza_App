import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validate';
import { SafetyService } from '../safety/safety.service';
import { prisma } from '../../config/database';

export const conversationsRouter = Router();

const StartSessionSchema = z.object({
  body: z.object({
    childId: z.string().min(1, 'Child ID is required'),
    characterId: z.string().min(1, 'Character ID is required'),
    language: z.enum(['en', 'hi', 'gu']).default('en'),
  }),
});

const MessageSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, 'Session ID required'),
    childId: z.string().min(1, 'Child ID required'),
    characterId: z.string().min(1, 'Character ID required'),
    text: z.string().min(1, 'Message text required'),
    language: z.enum(['en', 'hi', 'gu']).default('en'),
  }),
});

const EndSessionSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, 'Session ID required'),
    durationSeconds: z.number().nonnegative(),
  }),
});

const inMemorySessions = new Map<string, any>();

// POST /api/conversations/start
conversationsRouter.post('/start', validateRequest(StartSessionSchema), async (req: Request, res: Response) => {
  const { childId, characterId, language } = req.body;

  try {
    let session = null;
    try {
      session = await prisma.session.create({
        data: {
          childId,
          characterId,
          language,
        },
      });
    } catch {
      session = {
        id: `sess-${Date.now()}`,
        childId,
        characterId,
        language,
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
      };
      inMemorySessions.set(session.id, session);
    }

    return res.status(201).json({
      success: true,
      message: 'Companion session started',
      data: session,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/conversations/message (with Safety Guardrails)
conversationsRouter.post('/message', validateRequest(MessageSchema), async (req: Request, res: Response) => {
  const { sessionId, childId, characterId, text, language } = req.body;

  // 1. Run Input Safety Check
  const inputCheck = SafetyService.validateInput(text, language);
  if (!inputCheck.isSafe) {
    // Record safety event
    try {
      await prisma.safetyEvent.create({
        data: { childId, eventType: 'SENSITIVE_INPUT_BLOCKED' },
      });
    } catch {}

    return res.json({
      success: true,
      data: {
        text: inputCheck.sanitizedText,
        animationState: 'HAPPY',
        safetyTriggered: true,
      },
    });
  }

  // 2. Age-appropriate Companion Response Generation (Preschool 3–5)
  let rawResponse = '';
  if (language === 'hi') {
    rawResponse = `वाह! यह कितना प्यारा है! चलो साथ में मिलकर कुछ नया सीखते हैं!`;
  } else if (language === 'gu') {
    rawResponse = `અરે વાહ! આ તો બહુ સરસ છે! ચાલો આપણે સાથે કંઈક નવું શીખીએ!`;
  } else {
    rawResponse = `Yay! That is so wonderful and fun! Let's explore together!`;
  }

  // 3. Run Output Safety Check
  const outputCheck = SafetyService.validateOutput(rawResponse, language);

  return res.json({
    success: true,
    data: {
      text: outputCheck.sanitizedText,
      animationState: 'TALKING',
      safetyTriggered: false,
    },
  });
});

// POST /api/conversations/end
conversationsRouter.post('/end', validateRequest(EndSessionSchema), async (req: Request, res: Response) => {
  const { sessionId, durationSeconds } = req.body;

  try {
    try {
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          durationSeconds,
        },
      });
    } catch {
      const sess = inMemorySessions.get(sessionId);
      if (sess) {
        sess.endedAt = new Date().toISOString();
        sess.durationSeconds = durationSeconds;
      }
    }

    return res.json({
      success: true,
      message: 'Companion session ended successfully',
      durationSeconds,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
