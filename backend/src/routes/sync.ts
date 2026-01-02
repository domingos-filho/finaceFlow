import { TransactionType, WalletRole } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth';
import { hasRequiredRole } from '../utils/access';

const router = Router();

const syncSchema = z.object({
  walletId: z.string().uuid(),
  lastSyncedAt: z.coerce.date().optional(),
  transactions: z
    .array(
      z.object({
        id: z.string().uuid(),
        type: z.nativeEnum(TransactionType),
        description: z.string(),
        amount: z.number(),
        timestamp: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
      })
    )
    .default([]),
});

router.use(authenticate);

async function userCanSync(walletId: string, userId: string) {
  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId, userId } } });
  if (!membership) return null;
  return hasRequiredRole(membership.role, WalletRole.EDITOR) ? membership : null;
}

router.post('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const parsed = syncSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const { walletId, transactions, lastSyncedAt } = parsed.data;
  const membership = await userCanSync(walletId, req.user.id);
  if (!membership) return res.status(403).json({ message: 'Sem permissão para sincronizar' });

  const results = [] as string[];

  for (const tx of transactions) {
    const existing = await prisma.transaction.findUnique({ where: { id: tx.id } });
    if (!existing) {
      await prisma.transaction.create({
        data: {
          id: tx.id,
          walletId,
          userId: req.user.id,
          type: tx.type,
          description: tx.description,
          amount: tx.amount,
          timestamp: tx.timestamp,
          synced: true,
        },
      });
      results.push(tx.id);
      continue;
    }

    const incomingUpdatedAt = tx.updatedAt ?? tx.timestamp;
    if (incomingUpdatedAt > existing.updatedAt) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          timestamp: tx.timestamp,
          synced: true,
        },
      });
      results.push(tx.id);
    }
  }

  const serverChanges = await prisma.transaction.findMany({
    where: {
      walletId,
      updatedAt: lastSyncedAt ? { gt: lastSyncedAt } : undefined,
    },
    orderBy: { updatedAt: 'asc' },
  });

  return res.json({
    synced: results,
    serverTransactions: serverChanges,
  });
});

export default router;
