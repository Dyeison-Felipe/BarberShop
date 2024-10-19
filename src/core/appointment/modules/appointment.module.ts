import { BuildModule, IModule } from '../../../shared/modules/module.js';
import { db } from '../../../shared/repositories/firebase/config.js';
import { AppointmentController } from '../controller/appointment.controller.js';
import { AppointmentFirebaseRepository } from '../repositories/firebase/appointment-firebase.repository.js';
import { AppointmentServiceImpl } from '../service/implementations/appointment.service.js';

export class AppointmentModule implements IModule {
  buildModule(): BuildModule {
    const appointmentRepository = new AppointmentFirebaseRepository(db);
    const appointmentService = new AppointmentServiceImpl(
      appointmentRepository,
    );
    const appointmentController = new AppointmentController(appointmentService);

    return {
      controllers: [appointmentController],
    };
  }
}
