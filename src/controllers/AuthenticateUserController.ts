import { Request, Response } from 'express';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;

    const authService = new AuthenticateUserService();

    try {
      const result = await authService.execute(code);
      return res.json(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        return res.json(e.message);
      }
    }
  }
}

export { AuthenticateUserController };
