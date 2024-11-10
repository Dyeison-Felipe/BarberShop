import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { ImageFirebaseStorageService } from '../../../shared/services/image/firestore/image-firebase-storage.service.js';
import { AsyncLocalStorageService } from '../../../shared/storage-request-service/async-local-storage/async-local-storage-service.js';
import { BarberShopController } from '../controller/barber-shop.controller.js';
import { BarberShopFirebaseRepository } from '../repositories/firebase/barber-shop-firebase.repository.js';
import { BarberShopMongoRepository } from '../repositories/mongo/barber-shop-mongo.repository.js';
import { BarberShopServiceImpl } from '../service/implementations/barber-shop.service.js';

export class BarberShopModule implements IModule {
  buildModule(): BuildModule {
    // const barberShopRepository = new BarberShopFirebaseRepository(db);
    const barberShopRepository = new BarberShopMongoRepository();
    const imageService = new ImageFirebaseStorageService();
    const asyncLocalStorageService = new AsyncLocalStorageService();
    const barberShopService = new BarberShopServiceImpl(
      barberShopRepository,
      imageService,
      asyncLocalStorageService,
    );
    const barberShopController = new BarberShopController(barberShopService);

    return {
      controllers: [barberShopController],
    };
  }
}
