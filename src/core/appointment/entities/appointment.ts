export type CreateAppointment = {
  barberServiceId: string;
  barberShopId: string;
  clientId: string;
  date: Date;
};

export type AppointmentProps = CreateAppointment & {
  id: string;
};

export class Appointment {
  private constructor(private readonly props: AppointmentProps) {}

  get id() {
    return this.props.id;
  }

  get barberServiceId() {
    return this.props.barberServiceId;
  }

  get barberShopId() {
    return this.props.barberShopId;
  }

  get clientId() {
    return this.props.clientId;
  }

  get date() {
    return this.props.date;
  }

  static createAppointment(create: CreateAppointment) {
    return new Appointment({
      barberServiceId: create.barberServiceId,
      barberShopId: create.barberShopId,
      clientId: create.clientId,
      date: create.date,
      id: crypto.randomUUID().toString(),
    });
  }

  toObject() {
    return {
      id: this.id,
      barberServiceId: this.barberServiceId,
      barberShopId: this.barberShopId,
      clientId: this.clientId,
      date: this.date,
    };
  }
}
