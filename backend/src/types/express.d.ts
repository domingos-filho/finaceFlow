import { UserRole, WalletRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface WalletAccess {
  walletId: string;
  role: WalletRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      walletAccess?: WalletAccess;
    }
  }
}
