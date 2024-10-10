export type AppointmentProps = {
  id: string;
  barberServiceId: string;
  barberShopId: string;
  clientId: string;
  date: string;
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
}
