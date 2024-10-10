export type BarberServiceProps = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

export class BarberService {
  constructor(private readonly props: BarberServiceProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get price() {
    return this.props.price;
  }

  get duration() {
    return this.props.duration;
  }

  get barberShopId() {
    return this.props.barberShopId;
  }
}
