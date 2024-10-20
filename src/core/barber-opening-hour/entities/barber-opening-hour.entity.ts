import { create } from "domain";
import { start } from "repl";

export type OpeningHoursProps = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export type CreateOpeningHours = {
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
}

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

  static createOpeningHours(createOpeningHours: CreateOpeningHours) {
    return new OpeningHours({
      id: crypto.randomUUID().toString(),
      weekday: createOpeningHours.weekday,
      start: createOpeningHours.start,
      end: createOpeningHours.end,
      barberShopId: createOpeningHours.barberShopId,
    })
  }

  toObject() {
    return {
      id: this.id,
      weekday: this.weekday,
      start: this.start,
      end: this.end,
      barberShopId: this.barberShopId,
    };
  }

}
