import {
  PaginationInput,
  PaginationOutput,
} from '../../../shared/repositories/pagination.repository.js';
import { Appointment } from '../entities/appoiment.entity.js';

type AppointmentBase = {
  id: string;
  date: Date;
  service: {
    id: string;
    name: string;
    price: number;
  };
};

export type ClientAppointment = AppointmentBase & {
  barber: {
    id: string;
    photoUrl: string;
    name: string;
  };
};

export type BarberShopAppointment = AppointmentBase & {
  client: {
    id: string;
    photoUrl: string;
    name: string;
  };
};

export interface AppointmentRepository {
  createAppointment(appointment: Appointment): Promise<Appointment | null>;

  getAppointmentsByClientId(
    clientId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<ClientAppointment>>;

  getAppointmentsByBarberId(
    barberId: string,
    pagination: PaginationInput,
  ): Promise<PaginationOutput<BarberShopAppointment>>;
}
