import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { AsyncLocalStorageService } from '../../../shared/storage-request-service/async-local-storage/async-local-storage-service.js';
import { ClientFavoriteController } from '../controller/client-favorite.controller.js';
import { ClientFavoriteFirebaseRepository } from '../repositories/firebase/client-favorite-firebase.repository.js';
import { ClientFavoriteServiceImpl } from '../service/implementation/client-favorite.service.js';

export class ClientFavoriteListModule implements IModule {
  buildModule(): BuildModule {
    const clientFavoriteRepository = new ClientFavoriteFirebaseRepository(db);
    const asyncLocalStorageService = new AsyncLocalStorageService();

    const clientFavoriteService = new ClientFavoriteServiceImpl(
      clientFavoriteRepository,
      asyncLocalStorageService,
    );
    const clientFavoriteController = new ClientFavoriteController(
      clientFavoriteService,
    );

    return {
      controllers: [clientFavoriteController],
    };
  }
}
