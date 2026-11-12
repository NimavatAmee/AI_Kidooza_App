import { Router, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { validateRequest } from '../../middleware/validate';
import { SafetyService } from '../safety/safety.service';
import { SttService } from '../speech/stt.service';
import { AiService } from '../ai/ai.service';
import { TtsService } from '../speech/tts.service';
import { prisma } from '../../config/database';

export const conversationsRouter = Router();

// Memory storage for ephemeral audio processing (Section 8: Never store raw child audio on disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

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

// POST /api/conversations/speech (Phase 4 Full Voice Pipeline: STT -> Safety -> AI -> TTS)
conversationsRouter.post('/speech', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const sessionId = (req.body.sessionId as string) || `sess-${Date.now()}`;
    const childId = (req.body.childId as string) || 'default-child';
    const characterId = (req.body.characterId as string) || 'dino';
    const language = (req.body.language as string) || 'en';
    const childNickname = (req.body.childNickname as string) || 'Aarav';

    const audioBuffer = req.file?.buffer || Buffer.from('mock-audio');

    // 1. Speech-to-Text (STT)
    const transcription = await SttService.transcribeAudio(audioBuffer, language);

    // 2. Input Safety Guardrails
    const inputSafety = SafetyService.validateInput(transcription.text, language);
    if (!inputSafety.isSafe) {
      try {
        await prisma.safetyEvent.create({
          data: { childId, eventType: 'SENSITIVE_INPUT_BLOCKED' },
        });
      } catch {}

      return res.json({
        success: true,
        data: {
          recognizedText: transcription.text,
          characterReply: inputSafety.sanitizedText,
          animationState: 'HAPPY',
          speechDurationMs: 3200,
          safetyTriggered: true,
        },
      });
    }

    // 3. AI Companion Persona Generation
    const aiReply = await AiService.generateResponse(
      inputSafety.sanitizedText,
      characterId,
      language,
      childNickname
    );

    // 4. Output Safety Validation
    const outputSafety = SafetyService.validateOutput(aiReply.text, language);

    // 5. Text-to-Speech (TTS) Synthesis
    const ttsResult = await TtsService.synthesizeSpeech(
      outputSafety.sanitizedText,
      characterId,
      language
    );

    // 6. Record minimal usage event (no raw audio)
    try {
      await prisma.usageEvent.create({
        data: {
          parentId: 'parent-active',
          childId,
          eventType: 'VOICE_INTERACTION',
          metadata: { characterId, language, durationMs: ttsResult.durationMs },
        },
      });
    } catch {}

    return res.json({
      success: true,
      data: {
        recognizedText: transcription.text,
        characterReply: outputSafety.sanitizedText,
        animationState: aiReply.animationState,
        speechDurationMs: ttsResult.durationMs,
        audioUrl: ttsResult.audioUrl,
        safetyTriggered: false,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/conversations/message (Direct Text Route)
conversationsRouter.post('/message', validateRequest(MessageSchema), async (req: Request, res: Response) => {
  const { sessionId, childId, characterId, text, language } = req.body;

  const inputCheck = SafetyService.validateInput(text, language);
  if (!inputCheck.isSafe) {
    return res.json({
      success: true,
      data: {
        text: inputCheck.sanitizedText,
        animationState: 'HAPPY',
        safetyTriggered: true,
      },
    });
  }

  const aiReply = await AiService.generateResponse(text, characterId, language, 'friend');
  const outputCheck = SafetyService.validateOutput(aiReply.text, language);

  return res.json({
    success: true,
    data: {
      text: outputCheck.sanitizedText,
      animationState: aiReply.animationState,
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
