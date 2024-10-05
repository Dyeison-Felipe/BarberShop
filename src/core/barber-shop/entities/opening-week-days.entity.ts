import { OpeningHours } from "./opening-hours.entity";

export type OpeningWeekDaysProps = {
  name: string;
  openingHours: OpeningHours[];
}

export class OpeningWeekDays {
  constructor(private readonly props: OpeningWeekDaysProps) {
    this.props = props;
  }

  get name() {
    return this.props.name;
  }

  get openingHours() {
    return this.props.openingHours;
  }
}