import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { AsyncLocalStorageService } from '../../../shared/storage-request-service/async-local-storage/async-local-storage-service.js';
import { AppointmentController } from '../controller/appointment.controller.js';
import { AppointmentFirebaseRepository } from '../repositories/firebase/appointment-firebase.repository.js';
import { AppointmentMongoRepository } from '../repositories/mongo/appointment-mongo.repository.js';
import { AppointmentServiceImpl } from '../service/implementations/appointment.service.js';

export class AppointmentModule implements IModule {
  buildModule(): BuildModule {
    // const appointmentRepository = new AppointmentFirebaseRepository(db);
    const appointmentRepository = new AppointmentMongoRepository();
    const asyncLocalStorageService = new AsyncLocalStorageService();
    const appointmentService = new AppointmentServiceImpl(
      appointmentRepository,
      asyncLocalStorageService,
    );
    const appointmentController = new AppointmentController(appointmentService);

    return {
      controllers: [appointmentController],
    };
  }
}
