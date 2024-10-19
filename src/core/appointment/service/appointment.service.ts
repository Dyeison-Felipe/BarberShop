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
  createAppointment(
    createAppointmentInput: CreateAppointmentInput,
  ): Promise<AppointmentOutput>;
}
