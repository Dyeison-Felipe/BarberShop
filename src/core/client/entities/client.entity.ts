export type ClientProps = {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  photoUrl: string;
};

export type UpdateClient = { photoUrl?: string; name?: string };

export type CreateClient = {
  name: string;
  email: string;
  password: string;
};

export class Client {
  constructor(private props: ClientProps) {}

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

  static createClient(create: CreateClient): Client {
    return new Client({
      id: crypto.randomUUID().toString(),
      name: create.name,
      email: create.email,
      password: create.password,
      phoneNumber: '',
      photoUrl: '',
    });
  }

  updateClient(update: UpdateClient) {
    this.props = {
      ...this.props,
      ...update,
    };
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      photoUrl: this.photoUrl,
    };
  }
}
