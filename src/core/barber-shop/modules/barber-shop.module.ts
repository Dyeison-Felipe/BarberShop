import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { BarberShopController } from '../controller/barber-shop.controller.js';
import { BarberShopFirebaseRepository } from '../repositories/firebase/barber-shop-firebase.repository.js';
import { BarberShopServiceImpl } from '../service/implementations/barber-shop.service.js';

export class BarberShopModule implements IModule {
  buildModule(): BuildModule {
    const barberShopRepository = new BarberShopFirebaseRepository(db);
    const barberShopService = new BarberShopServiceImpl(barberShopRepository);
    const barberShopController = new BarberShopController(barberShopService);

    return {
      controllers: [barberShopController],
    };
  }
}