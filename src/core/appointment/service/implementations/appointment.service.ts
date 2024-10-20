import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { Appointment } from '../../entities/appoiment.entity.js';
import {
  AppointmentRepository,
  BarberShopAppointment,
  ClientAppointment,
} from '../../repositories/appointment.repository.js';
import {
  AppointmentOutput,
  AppointmentService,
  CreateAppointmentInput,
  GetBarberShopAppointmentsInput,
  GetClientAppointmentsInput,
} from '../appointment.service.js';

export class AppointmentServiceImpl implements AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async getClientAppointments({
    pagination,
  }: GetClientAppointmentsInput): Promise<PaginationOutput<ClientAppointment>> {
    // TODO Colocar o ID do cliente logado
    const clientId = 'ae97dc5e-7105-43d2-9d53-62b180905094';

    const appointments =
      await this.appointmentRepository.getAppointmentsByClientId(
        clientId,
        pagination,
      );

    return appointments;
  }

  async getBarberShopAppointments({
    pagination,
    barberShopId,
  }: GetBarberShopAppointmentsInput): Promise<
    PaginationOutput<BarberShopAppointment>
  > {
    const appointments =
      await this.appointmentRepository.getAppointmentsByBarberId(
        barberShopId,
        pagination,
      );

    return appointments;
  }

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
