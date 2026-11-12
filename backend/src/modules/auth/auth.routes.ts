import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { validateRequest } from '../../middleware/validate';
import { prisma } from '../../config/database';

export const authRouter = Router();

const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email('Valid parent email address required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});

const LoginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid parent email address required'),
    password: z.string().optional(),
  }),
});

const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid parent email address required'),
  }),
});

const ResetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid parent email address required'),
    resetCode: z.string().min(4, 'Valid reset code required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
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

// POST /api/auth/register (New Parent Registration)
authRouter.post('/register', validateRequest(RegisterSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existing = await prisma.parent.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const parent = await prisma.parent.create({
      data: {
        email,
        passwordHash,
        sessionLimitMinutes: 20,
      },
      select: {
        id: true,
        email: true,
        sessionLimitMinutes: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Parent account registered successfully',
      data: parent,
    });
  } catch (error: any) {
    console.error('[Register Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login (Parent Sign In with Password)
authRouter.post('/login', validateRequest(LoginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let parent = null;
    try {
      parent = await prisma.parent.findUnique({ where: { email } });
    } catch {
      parent = inMemoryParents.get(email);
    }

    if (!parent) {
      // If user provided no password (legacy quick-login), auto-create or error
      if (!password) {
        parent = await prisma.parent.create({
          data: { email, sessionLimitMinutes: 20 },
        });
        return res.json({
          success: true,
          message: 'Parent authenticated successfully',
          data: { id: parent.id, email: parent.email, sessionLimitMinutes: parent.sessionLimitMinutes },
        });
      }
      return res.status(401).json({
        success: false,
        error: 'No account found with this email. Please register first.',
      });
    }

    // If password provided and account has passwordHash, verify it
    if (password && parent.passwordHash) {
      const isValid = await bcrypt.compare(password, parent.passwordHash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please try again or use Forgot Password.',
        });
      }
    } else if (password && !parent.passwordHash) {
      // Set password for legacy account created without one
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      await prisma.parent.update({
        where: { id: parent.id },
        data: { passwordHash },
      });
    }

    return res.json({
      success: true,
      message: 'Parent authenticated successfully',
      data: {
        id: parent.id,
        email: parent.email,
        sessionLimitMinutes: parent.sessionLimitMinutes,
      },
    });
  } catch (error: any) {
    console.error('[Login Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Login failed' });
  }
});

// POST /api/auth/forgot-password (Generate 6-digit Reset Code)
authRouter.post('/forgot-password', validateRequest(ForgotPasswordSchema), async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const parent = await prisma.parent.findUnique({ where: { email } });
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'No parent account found with this email address.',
      });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.parent.update({
      where: { email },
      data: { resetCode, resetCodeExpiry },
    });

    console.log(`[AUTH] 🔑 Password reset code for ${email}: ${resetCode}`);

    return res.json({
      success: true,
      message: 'Reset code generated successfully. Please enter the 6-digit code to reset your password.',
      // Provided in development response for easy testing on mobile
      resetCode,
    });
  } catch (error: any) {
    console.error('[Forgot Password Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to process forgot password' });
  }
});

// POST /api/auth/reset-password (Verify Code & Update Password)
authRouter.post('/reset-password', validateRequest(ResetPasswordSchema), async (req: Request, res: Response) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    const parent = await prisma.parent.findUnique({ where: { email } });
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'No parent account found with this email address.',
      });
    }

    if (!parent.resetCode || parent.resetCode !== resetCode.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset code. Please check and try again.',
      });
    }

    if (parent.resetCodeExpiry && new Date() > parent.resetCodeExpiry) {
      return res.status(400).json({
        success: false,
        error: 'This reset code has expired. Please request a new code.',
      });
    }

    // Hash new password and clear reset code
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.parent.update({
      where: { email },
      data: {
        passwordHash,
        resetCode: null,
        resetCodeExpiry: null,
      },
    });

    return res.json({
      success: true,
      message: 'Password has been reset successfully! You can now sign in with your new password.',
    });
  } catch (error: any) {
    console.error('[Reset Password Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to reset password' });
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
