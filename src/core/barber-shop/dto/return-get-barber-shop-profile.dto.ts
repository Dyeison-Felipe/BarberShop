export class ReturnGetBarberShopProfileDto {
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
  clientId: string;
}
