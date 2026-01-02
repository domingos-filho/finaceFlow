import { TransactionType, WalletRole } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth';
import { hasRequiredRole } from '../utils/access';

const router = Router();

const transactionSchema = z.object({
  walletId: z.string().uuid(),
  type: z.nativeEnum(TransactionType),
  description: z.string().min(1),
  amount: z.number(),
  timestamp: z.coerce.date().optional(),
  synced: z.boolean().optional(),
  id: z.string().uuid().optional(),
});

router.use(authenticate);

async function ensureEditPermission(walletId: string, userId: string) {
  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId, userId } } });
  if (!membership) return null;
  return hasRequiredRole(membership.role, WalletRole.EDITOR) ? membership : null;
}

router.get('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const walletId = req.query.walletId as string | undefined;

  const where = walletId
    ? { walletId, wallet: { members: { some: { userId: req.user.id } } } }
    : { wallet: { members: { some: { userId: req.user.id } } } };

  const transactions = await prisma.transaction.findMany({ where, orderBy: { timestamp: 'desc' } });
  return res.json(transactions);
});

router.post('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const membership = await ensureEditPermission(parsed.data.walletId, req.user.id);
  if (!membership) return res.status(403).json({ message: 'Sem permissão para adicionar lançamentos' });

  const transaction = await prisma.transaction.create({
    data: {
      id: parsed.data.id,
      walletId: parsed.data.walletId,
      userId: req.user.id,
      type: parsed.data.type,
      description: parsed.data.description,
      amount: parsed.data.amount,
      timestamp: parsed.data.timestamp ?? new Date(),
      synced: parsed.data.synced ?? false,
    },
  });
  return res.status(201).json(transaction);
});

router.patch('/:id', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const parsed = transactionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const transaction = await prisma.transaction.findUnique({ where: { id: req.params.id } });
  if (!transaction) return res.status(404).json({ message: 'Lançamento não encontrado' });

  const membership = await ensureEditPermission(transaction.walletId, req.user.id);
  if (!membership) return res.status(403).json({ message: 'Sem permissão para editar' });

  const updated = await prisma.transaction.update({
    where: { id: req.params.id },
    data: { ...parsed.data, synced: false },
  });
  return res.json(updated);
});

router.delete('/:id', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const transaction = await prisma.transaction.findUnique({ where: { id: req.params.id } });
  if (!transaction) return res.status(404).json({ message: 'Lançamento não encontrado' });

  const membership = await ensureEditPermission(transaction.walletId, req.user.id);
  if (!membership) return res.status(403).json({ message: 'Sem permissão para excluir' });

  await prisma.transaction.delete({ where: { id: req.params.id } });
  return res.sendStatus(204);
});

export default router;
