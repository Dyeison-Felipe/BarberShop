import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { ClientAppointment } from '../repositories/appointment.repository.js';

export type GetClientAppointmentsInput = {
  pagination: PaginationInput;
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

  createAppointment(
    createAppointmentInput: CreateAppointmentInput,
  ): Promise<AppointmentOutput>;
}
