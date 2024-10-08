import { Appointments } from "./appointments.entity.js";
import { FavoriteList } from "./favorite_list.entity.js";

export type ClientProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: number
  photoUrl?: string;
  appointments: Appointments[];
  favoriteList: FavoriteList[];
}

export type UpdateClient = CreateClient &{id: string, photoUrl: string}

export type CreateClient = {
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export class Client {
  private constructor(private readonly props: ClientProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  get appointments() {
    return this.props.appointments;
  }

  get favoriteList() {
    return this.props.favoriteList;
  }

  static createClient(create: CreateClient): Client {
    return new Client ({
      id: crypto.randomUUID().toString(),
      name: create.name,
      email: create.email,
      password: create.password,
      phoneNumber: create.phoneNumber,
      photoUrl: '',
      appointments: [],
      favoriteList: [],
    });
  }

  static updateClient(id: string, update: UpdateClient, existingClient: Client): Client {
    return new Client({
      id: id,
      name: update.name,
      email: update.email,
      password: update.password,
      phoneNumber: update.phoneNumber,
      photoUrl: update.photoUrl,
      appointments: existingClient.appointments,
      favoriteList: existingClient.favoriteList,
    })
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      photoUrl: this.photoUrl,
      appointments: this.appointments,
      favoriteList: this.favoriteList,
    };
  }
}