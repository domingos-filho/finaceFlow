import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth';
import syncRoutes from './routes/sync';
import transactionRoutes from './routes/transactions';
import walletRoutes from './routes/wallets';

dotenv.config();

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/auth', authRoutes);
  app.use('/wallets', walletRoutes);
  app.use('/transactions', transactionRoutes);
  app.use('/sync', syncRoutes);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  });

  return app;
};
