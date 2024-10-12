import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';
import { ClientController } from '../controller/client.controller.js';
import { ClientFirebaseRepository } from '../repositories/firebase/client-firebase.repository.js';
import { ClientServiceImpl } from '../service/implementation/client.service.js';

export class ClientModule implements IModule {
  buildModule(): BuildModule {
    const clientRepository = new ClientFirebaseRepository(db);
    const imageService = new ImageFirebaseStorageService();
    const clientService = new ClientServiceImpl(clientRepository, imageService);
    const clientController = new ClientController(clientService);

    return {
      controllers: [clientController],
    };
  }
}
