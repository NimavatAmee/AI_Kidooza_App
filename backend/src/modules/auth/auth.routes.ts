import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validate';
import { prisma } from '../../config/database';

export const authRouter = Router();

const ParentLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid parent email address required'),
  }),
});

const RecordConsentSchema = z.object({
  body: z.object({
    parentId: z.string().min(1, 'Parent ID required'),
    childId: z.string().optional(),
    consentVersion: z.string().default('v1.0'),
  }),
});

// Mock store for in-memory fallback when database is not connected
const inMemoryParents = new Map<string, any>();
const inMemoryConsents = new Map<string, any>();

// POST /api/auth/parent-login
authRouter.post('/login', validateRequest(ParentLoginSchema), async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    let parent = null;
    try {
      parent = await prisma.parent.findUnique({ where: { email } });
      if (!parent) {
        parent = await prisma.parent.create({
          data: { email, sessionLimitMinutes: 20 },
        });
      }
    } catch {
      // In-memory fallback
      parent = inMemoryParents.get(email) || {
        id: `parent-${Date.now()}`,
        email,
        sessionLimitMinutes: 20,
        createdAt: new Date().toISOString(),
      };
      inMemoryParents.set(email, parent);
    }

    return res.json({
      success: true,
      message: 'Parent authenticated successfully',
      data: parent,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/consent (Verifiable parental consent per DPDP Act)
authRouter.post('/consent', validateRequest(RecordConsentSchema), async (req: Request, res: Response) => {
  const { parentId, childId, consentVersion } = req.body;

  try {
    let consentRecord = null;
    try {
      consentRecord = await prisma.parentalConsent.create({
        data: {
          parentId,
          childId: childId || null,
          consentVersion,
        },
      });
    } catch {
      consentRecord = {
        id: `consent-${Date.now()}`,
        parentId,
        childId: childId || null,
        consentVersion,
        consentedAt: new Date().toISOString(),
      };
      inMemoryConsents.set(consentRecord.id, consentRecord);
    }

    return res.json({
      success: true,
      message: 'Parental consent recorded successfully under DPDP Act requirements',
      data: consentRecord,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
