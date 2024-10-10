export type OpeningHoursProps = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export class OpeningHours {
  constructor(private readonly props: OpeningHoursProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get weekday() {
    return this.props.weekday;
  }

  get start() {
    return this.props.start;
  }

  get end() {
    return this.props.end;
  }

  get barberShopId() {
    return this.props.barberShopId;
  }
}
