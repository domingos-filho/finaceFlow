import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthUser } from '../types/express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Configuração JWT ausente' });
    }
    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
