import {
  PaginationInput,
  PaginationOutput,
} from '../../../../shared/repositories/pagination.repository.js';
import { StorageRequestService } from '../../../../shared/storage-request-service/storage-request-service.js';
import { Constants } from '../../../../shared/utils/constants.js';
import { ClientProps } from '../../../client/entities/client.entity.js';
import { Appointment } from '../../entities/appointment.js';
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
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly storageRequestService: StorageRequestService,
  ) {}

  async getClientAppointments({
    pagination,
  }: GetClientAppointmentsInput): Promise<PaginationOutput<ClientAppointment>> {
    const loggedUser = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );
    console.log('🚀 ~ AppointmentServiceImpl ~ loggedUser:', loggedUser);

    const appointments =
      await this.appointmentRepository.getAppointmentsByClientId(
        loggedUser!.id,
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
    const loggedUser = this.storageRequestService.get<ClientProps>(
      Constants.loggedUser,
    );

    const appointmentEntity = Appointment.createAppointment({
      ...createAppointmentInput,
      clientId: loggedUser!.id,
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
