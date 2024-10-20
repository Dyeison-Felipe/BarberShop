import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import {
  BarberShopAppointment,
  ClientAppointment,
} from '../repositories/appointment.repository.js';

type GetAppointmentPaginated = {
  pagination: PaginationInput;
};

export type GetClientAppointmentsInput = GetAppointmentPaginated;

export type GetBarberShopAppointmentsInput = GetAppointmentPaginated & {
  barberShopId: string;
};

export type CreateAppointmentInput = {
  barberServiceId: string;
  barberShopId: string;
  date: Date;
};

export type AppointmentOutput = {
  id: string;
  barberServiceId: string;
  barberShopId: string;
  clientId: string;
  date: Date;
};

export interface AppointmentService {
  getClientAppointments(
    input: GetClientAppointmentsInput,
  ): Promise<PaginationOutput<ClientAppointment>>;

  getBarberShopAppointments(
    input: GetBarberShopAppointmentsInput,
  ): Promise<PaginationOutput<BarberShopAppointment>>;

  createAppointment(
    createAppointmentInput: CreateAppointmentInput,
  ): Promise<AppointmentOutput>;
}
