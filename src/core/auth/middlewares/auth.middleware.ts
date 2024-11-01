import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../../../shared/middlewares/middleware.js';
import { ClientRepository } from '../../client/repositories/client.repository.js';

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly clientRepository: ClientRepository) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('class based middleware');
    next();
  }
}
