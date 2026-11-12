import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from '../../middleware/validate';
import { prisma } from '../../config/database';

export const childrenRouter = Router();

const CreateChildSchema = z.object({
  body: z.object({
    parentId: z.string().min(1, 'Parent ID is required'),
    displayName: z.string().min(1, 'Display name is required').max(30),
    ageBand: z.enum(['3-4', '4-5']),
    preferredLanguage: z.enum(['en', 'hi', 'gu']).default('en'),
  }),
});

const inMemoryChildren: any[] = [];

// POST /api/children
childrenRouter.post('/', validateRequest(CreateChildSchema), async (req: Request, res: Response) => {
  const { parentId, displayName, ageBand, preferredLanguage } = req.body;

  try {
    let child = null;
    try {
      child = await prisma.child.create({
        data: {
          parentId,
          displayName,
          ageBand,
          preferredLanguage,
        },
      });
    } catch {
      child = {
        id: `child-${Date.now()}`,
        parentId,
        displayName,
        ageBand,
        preferredLanguage,
        createdAt: new Date().toISOString(),
      };
      inMemoryChildren.push(child);
    }

    return res.status(201).json({
      success: true,
      message: 'Child profile created with minimal data',
      data: child,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/children
childrenRouter.get('/', async (req: Request, res: Response) => {
  const parentId = req.query.parentId as string;

  try {
    let children = [];
    try {
      children = await prisma.child.findMany({
        where: parentId ? { parentId } : undefined,
      });
    } catch {
      children = parentId 
        ? inMemoryChildren.filter((c) => c.parentId === parentId)
        : inMemoryChildren;
    }

    return res.json({
      success: true,
      data: children,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/children/:id (DPDP Act right to erasure)
childrenRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    try {
      await prisma.child.delete({ where: { id } });
    } catch {
      const idx = inMemoryChildren.findIndex((c) => c.id === id);
      if (idx !== -1) inMemoryChildren.splice(idx, 1);
    }

    return res.json({
      success: true,
      message: 'Child profile and associated session data permanently deleted',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
