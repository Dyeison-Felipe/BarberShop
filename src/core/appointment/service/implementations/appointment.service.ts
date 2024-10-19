import { Appointment } from '../../entities/appoiment.entity.js';
import { AppointmentRepository } from '../../repositories/appointment.repository.js';
import {
  AppointmentOutput,
  AppointmentService,
  CreateAppointmentInput,
} from '../appointment.service.js';

export class AppointmentServiceImpl implements AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async createAppointment(
    createAppointmentInput: CreateAppointmentInput,
  ): Promise<AppointmentOutput> {
    const appointmentEntity = Appointment.createAppointment({
      ...createAppointmentInput,
      // TODO Colocar o ID do cliente logado
      clientId: 'ae97dc5e-7105-43d2-9d53-62b180905094',
    });
    console.log(
      '🚀 ~ AppointmentServiceImpl ~ appointmentEntity:',
      appointmentEntity,
    );
    const createdAppointment =
      await this.appointmentRepository.createAppointment(appointmentEntity);

    if (!createdAppointment) {
      throw new Error('Erro ao criar usuário');
    }

    const appointmentOutput: AppointmentOutput = {
      id: createdAppointment.id,
      barberServiceId: createdAppointment.barberServiceId,
      barberShopId: createdAppointment.barberShopId,
      clientId: createdAppointment.clientId,
      date: createdAppointment.date,
    };

    return appointmentOutput;
  }
}
