import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from 'src/user/infraestructura/modelos/user.model';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers['authorization'];
    const authHeaderString = authHeader?.toString() || '';
    if (!authHeader)
      res.status(400).json({
        error: { message: 'Token must be provided' },
      });
    if (!process.env.NEXT_PUBLIC_JWT_SECRET_KEY)
      throw new Error('Secret key not set');
    const token = jwt.verify(
      authHeaderString,
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    );

    if (token == null) {
      res.status(401).json({ message: 'Token is not valid' });
    }

    const userInfoToken = jwt.verify(
      authHeaderString,
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    ) as UserModel;
    if (!userInfoToken.id) {
      res.status(401).json({ message: 'Token is not valid' });
    }
    const userExists =
      (
        await UserModel.getRepository().findBy({
          id: userInfoToken.id,
        })
      ).length > 0;

    if (!userExists) {
      res.status(401).json({ message: 'Token is not valid' });
    }

    next();
  } catch (error) {
    if (error instanceof Error)
      res.status(500).json({ error: { message: error.message } });
  }
}
