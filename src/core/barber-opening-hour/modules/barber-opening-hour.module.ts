import { IModule, BuildModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { BarberOpeningHoursController } from '../controllers/barber-opening-hour.controller.js';
import { BarberOpeningHoursFirebaseRepository } from '../repositories/firebase/barber-opening-hour-firebase.repository.js';
import { BarberOpeningHoursMongoRepository } from '../repositories/mongo/barber-opening-hour-mongo.repository.js';
import { BarberOpeningHoursServiceImpl } from '../services/implementation/barber-opening-hour.service.js';

export class BarberOpeningHoursModule implements IModule {
  buildModule(): BuildModule {
    const barberOpeningHoursRepository =
      new BarberOpeningHoursFirebaseRepository(db);
    // const barberOpeningHoursRepository =
    //   new BarberOpeningHoursMongoRepository();
    const barberOpeningHoursService = new BarberOpeningHoursServiceImpl(
      barberOpeningHoursRepository,
    );
    const barberOpeningHoursController = new BarberOpeningHoursController(
      barberOpeningHoursService,
    );

    return {
      controllers: [barberOpeningHoursController],
    };
  }
}
