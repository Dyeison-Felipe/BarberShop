import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { ClientController } from '../controller/client.controller.js';
import { ClientFirebaseRepository } from '../repositories/firebase/client-firebase.repository.js';
import { ClientServiceImpl } from '../service/implementation/client.service.js';

export class ClientModule implements IModule {
  buildModule(): BuildModule {
    const clientRepository = new ClientFirebaseRepository(db);
    const clientService = new ClientServiceImpl(clientRepository);
    const clientController = new ClientController(clientService);

    return {
      controllers: [clientController],
    };
  }
}
