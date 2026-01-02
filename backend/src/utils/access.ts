import { WalletRole } from '@prisma/client';

export const rolePriority: Record<WalletRole, number> = {
  [WalletRole.ADMIN]: 3,
  [WalletRole.EDITOR]: 2,
  [WalletRole.VIEWER]: 1,
};

export const hasRequiredRole = (current: WalletRole, required: WalletRole) => rolePriority[current] >= rolePriority[required];
