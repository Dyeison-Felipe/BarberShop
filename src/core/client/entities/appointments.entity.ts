export type AppointmentsProps = {
  id: string;
  appointmentsId: string;
  date: string;
}

export class Appointments {
  private constructor(private readonly props: AppointmentsProps) {}

  get id() {
    return this.props.id;
  }

  get appointmentsId() {
    return this.props.appointmentsId;
  }

  get date() {
    return this.props.date;
  }
}