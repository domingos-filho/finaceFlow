import { WalletRole } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';

import { prisma } from '../config/prisma';
import { authenticate } from '../middleware/auth';
import { hasRequiredRole } from '../utils/access';

const router = Router();

const walletSchema = z.object({ name: z.string().min(2) });

router.use(authenticate);

router.get('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401);

  const wallets = await prisma.wallet.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: { members: true },
  });
  return res.json(wallets);
});

router.post('/', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Apenas administradores podem criar carteiras' });

  const parsed = walletSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.format() });
  }

  const wallet = await prisma.wallet.create({
    data: {
      name: parsed.data.name,
      creator: { connect: { id: req.user.id } },
      members: { create: { userId: req.user.id, role: WalletRole.ADMIN } },
    },
  });
  return res.status(201).json(wallet);
});

router.get('/:id', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const wallet = await prisma.wallet.findFirst({ where: { id: req.params.id, members: { some: { userId: req.user.id } } }, include: { members: true } });
  if (!wallet) return res.status(404).json({ message: 'Carteira não encontrada ou sem acesso' });
  return res.json(wallet);
});

router.patch('/:id', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const parsed = walletSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId: req.params.id, userId: req.user.id } } });
  if (!membership || !hasRequiredRole(membership.role, WalletRole.ADMIN)) {
    return res.status(403).json({ message: 'Apenas admins da carteira podem editar' });
  }

  const wallet = await prisma.wallet.update({ where: { id: req.params.id }, data: parsed.data });
  return res.json(wallet);
});

router.delete('/:id', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId: req.params.id, userId: req.user.id } } });
  if (!membership || !hasRequiredRole(membership.role, WalletRole.ADMIN)) {
    return res.status(403).json({ message: 'Apenas admins da carteira podem remover' });
  }
  await prisma.wallet.delete({ where: { id: req.params.id } });
  return res.sendStatus(204);
});

const walletUserSchema = z.object({ userId: z.string().uuid(), role: z.nativeEnum(WalletRole) });

router.post('/:id/users', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const parsed = walletUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.format() });

  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId: req.params.id, userId: req.user.id } } });
  if (!membership || !hasRequiredRole(membership.role, WalletRole.ADMIN)) {
    return res.status(403).json({ message: 'Apenas admins da carteira podem gerenciar usuários' });
  }

  const walletUser = await prisma.walletUser.upsert({
    where: { walletId_userId: { walletId: req.params.id, userId: parsed.data.userId } },
    update: { role: parsed.data.role },
    create: { walletId: req.params.id, userId: parsed.data.userId, role: parsed.data.role },
  });
  return res.status(201).json(walletUser);
});

router.delete('/:id/users/:userId', async (req, res) => {
  if (!req.user) return res.sendStatus(401);
  const membership = await prisma.walletUser.findUnique({ where: { walletId_userId: { walletId: req.params.id, userId: req.user.id } } });
  if (!membership || !hasRequiredRole(membership.role, WalletRole.ADMIN)) {
    return res.status(403).json({ message: 'Apenas admins da carteira podem gerenciar usuários' });
  }
  await prisma.walletUser.delete({ where: { walletId_userId: { walletId: req.params.id, userId: req.params.userId } } });
  return res.sendStatus(204);
});

export default router;
