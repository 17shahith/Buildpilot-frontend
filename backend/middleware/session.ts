import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string | null;
        avatar_url: string | null;
      };
      session?: {
        id: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies.session_id;

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized: No session cookie' });
    }

    // Hash the token from the cookie to compare with the database
    const tokenHash = crypto.createHash('sha256').update(sessionId).digest('hex');

    const session = await prisma.session.findUnique({
      where: { token_hash: tokenHash },
      include: { user: true },
    });

    if (!session) {
      res.clearCookie('session_id');
      return res.status(401).json({ error: 'Unauthorized: Invalid session' });
    }

    if (session.expires_at < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      res.clearCookie('session_id');
      return res.status(401).json({ error: 'Unauthorized: Session expired' });
    }

    // Attach user to request
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      avatar_url: session.user.avatar_url,
    };
    
    req.session = {
      id: session.id
    };

    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
