// import { OpeningWeekDays } from './opening-week-days.entity.js';
// import { Services } from "./service.entity.js";

export type BarberShopProps = {
  id: string;
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  neighborhood: string;
  city: string;
  street: string;
  state: string;
  phone: string;
  rating: number;
  photoUrl?: string | null;
  clientId: string;
};

type UpsertBarberShop = {
  name: string;
  cnpj: string;
  cep: string;
  number: string;
  neighborhood: string;
  street: string;
  city: string;
  state: string;
  phone: string;
};

export type CreateBarberShop = UpsertBarberShop & {
  clientId: string;
};

type UpdateBarberShop = UpsertBarberShop & {
  photoUrl?: string;
};

export class BarberShop {
  constructor(private props: BarberShopProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get cnpj() {
    return this.props.cnpj;
  }

  get cep() {
    return this.props.cep;
  }

  get number() {
    return this.props.number;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get street() {
    return this.props.street;
  }

  get city() {
    return this.props.city;
  }

  get state() {
    return this.props.state;
  }
  get phone() {
    return this.props.phone;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  get rating() {
    return this.props.rating;
  }

  get clientId() {
    return this.props.clientId;
  }

  static createBarberShop(create: CreateBarberShop): BarberShop {
    return new BarberShop({
      id: crypto.randomUUID().toString(),
      name: create.name,
      cnpj: create.cnpj,
      cep: create.cep,
      number: create.number,
      neighborhood: create.neighborhood,
      city: create.city,
      state: create.state,
      street: create.street,
      phone: create.phone,
      clientId: create.clientId,
      rating: 5,
      photoUrl: null,
    });
  }

  updateBarberShop(update: UpdateBarberShop) {
    this.props = {
      ...this.props,
      name: update.name,
      cnpj: update.cnpj,
      cep: update.cep,
      number: update.number,
      neighborhood: update.neighborhood,
      street: update.street,
      city: update.city,
      state: update.state,
      phone: update.phone,
      photoUrl: update.photoUrl ?? '',
    };
  }

  toObject(): BarberShopProps {
    return {
      ...this.props,
    };
  }
}
