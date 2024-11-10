import { HashBcryptService } from '../../../shared/hashService/bcrypt/hash-bcrypt-service.js';
import { JsonWebTokenService } from '../../../shared/jwt-service/json-web-token/json-web-token-service.js';
import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { AsyncLocalStorageService } from '../../../shared/storage-request-service/async-local-storage/async-local-storage-service.js';
import { ClientFirebaseRepository } from '../../client/repositories/firebase/client-firebase.repository.js';
import { ClientMongoRepository } from '../../client/repositories/mongo/client-mongo.repository.js';
import { AuthController } from '../controller/auth.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';
import { AuthServiceImpl } from '../services/implementation/auth.service.js';

export class AuthModule implements IModule {
  buildModule(): BuildModule {
    // const clientRepository = new ClientFirebaseRepository(db);
    const clientRepository = new ClientMongoRepository();
    const hashService = new HashBcryptService();
    const jwtService = new JsonWebTokenService();
    const authService = new AuthServiceImpl(
      clientRepository,
      hashService,
      jwtService,
    );
    const asyncLocalStorageService = new AsyncLocalStorageService();
    const authController = new AuthController(authService);
    const authMiddleware = new AuthMiddleware(
      clientRepository,
      jwtService,
      asyncLocalStorageService,
    );
    return {
      controllers: [authController],
      middlewares: [{ provide: 'AuthMiddleware', instance: authMiddleware }],
    };
  }
}
