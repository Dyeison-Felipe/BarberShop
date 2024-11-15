import { HashBcryptService } from '../../../shared/hash-service/bcrypt/hash-bcrypt-service.js';
import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';
import { AsyncLocalStorageService } from '../../../shared/storage-request-service/async-local-storage/async-local-storage-service.js';
import { ClientController } from '../controller/client.controller.js';
import { ClientFirebaseRepository } from '../repositories/firebase/client-firebase.repository.js';
import { ClientMongoRepository } from '../repositories/mongo/client-mongo.repository.js';
import { ClientServiceImpl } from '../service/implementation/client.service.js';

export class ClientModule implements IModule {
  buildModule(): BuildModule {
    const clientRepository = new ClientFirebaseRepository(db);
    // const clientRepository = new ClientMongoRepository();
    const imageService = new ImageFirebaseStorageService();
    const hashService = new HashBcryptService();
    const asyncLocalStorageService = new AsyncLocalStorageService();
    const clientService = new ClientServiceImpl(
      clientRepository,
      imageService,
      hashService,
      asyncLocalStorageService,
    );
    const clientController = new ClientController(clientService);

    return {
      controllers: [clientController],
    };
  }
}
