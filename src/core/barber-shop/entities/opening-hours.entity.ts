export type OpeningHoursProps = {
  start: string;
  end: string;
}

export class OpeningHours {
  constructor(private readonly props: OpeningHoursProps) {
    this.props = props
  }

  get start() {
    return this.props.start;
  }

  get end() {
    return this.props.end;
  }
}