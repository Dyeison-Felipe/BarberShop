import { Request, Response, NextFunction, request } from 'express';
import { IMiddleware } from '../../../shared/middlewares/middleware.js';
import { ClientRepository } from '../../client/repositories/client.repository.js';
import { JwtService } from '../../../shared/jwt-service/jwt-service.js';
import { StorageRequestService } from '../../../shared/storage-request-service/storage-request-service.js';
import { LoginPayload } from '../services/auth.service.js';
import { Client } from '../../client/entities/client.entity.js';

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly jwtService: JwtService,
    private readonly storageRequestService: StorageRequestService,
  ) {
    this.extractTokenFromHeader = this.extractTokenFromHeader.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = this.extractTokenFromHeader(req);

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        throw new Error('jwtSecret invalido');
      }

      if (!token) {
        throw new Error('Acesso não autorizado');
      }

      const isJwtValid = this.jwtService.verifyJwt(token, jwtSecret);

      const jwtPayload = this.jwtService.decodeJwt<LoginPayload>(token);

      const loggedUser = await this.clientRepository.getClientById(
        jwtPayload.id,
      );

      console.log(
        '🚀 ~ AuthMiddleware ~ use ~ loggedUser?.isDeleted:',
        loggedUser?.isDeleted,
      );
      if (!isJwtValid || loggedUser?.isDeleted) {
        throw new Error('Acesso não autorizado');
      }

      this.storageRequestService.run(new Map<string, Client>(), () => {
        this.storageRequestService.set('logged_user', loggedUser?.toJSON());

        next();
      });
    } catch (error) {
      throw new Error('Acesso não autorizado');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
