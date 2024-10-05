import { OpeningWeekDays } from "./opening-week-days.entity";
import { Services } from "./service.entity";

export type BarberShopProps = {
  id: string;
  name: string;
  cnpj: number;
  cep: number;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  phone: number;
  rating: number;
  photoUrl?: string | null;
  openingWeekDays: OpeningWeekDays[];
  services: Services[];
}

export type CreateBarberShop = {
  name: string
  cnpj: number,
  cep: number,
  number: number,
  neighborhood: string,
  city: string,
  state: string,
  phone: number,
}

export class BarberShop {
private constructor(readonly props:BarberShopProps) {}

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

  get number(){
    return this.props.number
  }
  get neighborhood(){
    return this.props.neighborhood;
  }

  get city(){
    return this.props.city;
  }

  get state(){
    return this.props.state;
  }
  get phone(){
    return this.props.phone;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  get rating() {
    return this.props.rating;
  }

  teste() {
    
  }

  static createBarberShop( create: CreateBarberShop ): BarberShop {
    return new BarberShop({
      id: crypto.randomUUID().toString(),
      name: create.name,
      cnpj: create.cnpj,
      cep: create.cep,
      number:create.number,
      neighborhood: create.neighborhood,
      city: create.city,
      state: create.state,
      phone: create.phone,
      rating: 5,
      photoUrl: null,
      openingWeekDays: [],
      services: [],
    });
  }
  
}