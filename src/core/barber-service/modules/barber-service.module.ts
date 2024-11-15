import { IModule, BuildModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { BarberServiceController } from '../controllers/barber-service.controller.js';
import { BarberServiceFirebaseRepository } from '../repositories/firebase/barber-service-firebase.repository.js';
import { BarberServiceMongoRepository } from '../repositories/mongo/barber-service-mongo.repository.js';
import { BarberServiceServiceImpl } from '../services/implementation/barber-service.service.js';

export class BarberServiceModule implements IModule {
  buildModule(): BuildModule {
    const barberServiceRepository = new BarberServiceFirebaseRepository(db);
    // const barberServiceRepository = new BarberServiceMongoRepository();
    const barberServiceService = new BarberServiceServiceImpl(
      barberServiceRepository,
    );
    const barberServiceController = new BarberServiceController(
      barberServiceService,
    );

    return {
      controllers: [barberServiceController],
    };
  }
}
