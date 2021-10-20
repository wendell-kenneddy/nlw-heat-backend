import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      errorCode: 'token.invalid'
    });
  }

  // Bearer comes in index 0, and the token in index 1
  const token = authToken.split(' ')[1];

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload;
    req.user_id = sub;

    return next();
  } catch (error) {
    return res.status(401).json({
      errorCode: 'token.expired'
    });
  }
}
