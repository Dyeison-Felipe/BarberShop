export type BarberServiceProps = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

type CreateBarberService = {
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

  static createBarberService(create: CreateBarberService) {
    return new BarberService({
      id: crypto.randomUUID().toString(),
      barberShopId: create.barberShopId,
      duration: create.duration,
      price: create.price,
      name: create.name,
    });
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      duration: this.duration,
      barberShopId: this.barberShopId,
    };
  }
}
