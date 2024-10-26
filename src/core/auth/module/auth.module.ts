import { HashBcryptService } from "../../../shared/hashService/bcrypt/hash-bcrypt-service.js";
import { JsonWebTokenService } from "../../../shared/jwt-service/json-web-token/json-web-token-service.js";
import { BuildModule, IModule } from "../../../shared/modules/module.js";
import { db } from "../../../shared/repositories/firebase/config.js";
import { ClientFirebaseRepository } from "../../client/repositories/firebase/client-firebase.repository.js";
import { AuthController } from "../controller/auth.controller.js";
import { AuthServiceImpl } from "../services/implementation/auth.service.js";

export class AuthModule implements IModule {
  buildModule(): BuildModule {
    const clientRepository = new ClientFirebaseRepository(db);
    const hashService = new HashBcryptService();
    const jwtService = new JsonWebTokenService();
    const authService = new AuthServiceImpl(
      clientRepository,
      hashService,
      jwtService
    );
    const authController = new AuthController(authService);
    return {
      controllers: [authController],
    };
  }
}
