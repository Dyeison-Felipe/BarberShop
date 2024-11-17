import { Request, Response, NextFunction, request } from 'express';
import { IMiddleware } from '../../../shared/middlewares/middleware.js';
import { ClientRepository } from '../../client/repositories/client.repository.js';
import { JwtService } from '../../../shared/jwt-service/jwt-service.js';
import { StorageRequestService } from '../../../shared/storage-request-service/storage-request-service.js';
import { LoginPayload } from '../services/auth.service.js';
import { Client } from '../../client/entities/client.entity.js';
import { Constants } from '../../../shared/utils/constants.js';

export class LoggedClientMiddleware implements IMiddleware {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly jwtService: JwtService,
    private readonly storageRequestService: StorageRequestService,
  ) {
    this.extractTokenFromHeader = this.extractTokenFromHeader.bind(this);
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = this.extractTokenFromHeader(req);
    console.log('🚀 ~ LoggedClientMiddleware ~ use ~ token:', token);

    try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret || !token) {
        next();
        return;
      }

      const isJwtValid = this.jwtService.verifyJwt(token, jwtSecret);

      const jwtPayload = this.jwtService.decodeJwt<LoginPayload>(token);

      const loggedUser = await this.clientRepository.getClientById(
        jwtPayload.id,
      );

      if (!isJwtValid || loggedUser?.isDeleted) {
        next();
        return;
      }

      this.storageRequestService.run(new Map<string, Client>(), () => {
        this.storageRequestService.set(
          Constants.loggedUser,
          loggedUser?.toJSON(),
        );

        console.log(
          '🚀 ~ LoggedClientMiddleware ~ this.storageRequestService.run ~ loggedUser:',
          loggedUser,
        );
        next();
      });
    } catch (error) {
      next();
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
