export type ServicesProps = {
  id: string;
  name: string;
  price: number;
  duration: number
}

export class Services {
  constructor(private readonly props: ServicesProps) {
    this.props = props
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


}