export class ReturnGetClientFavoriteList {
  barberShop: GetBarberShop;
  clientId: string;
}

class GetBarberShop {
  id: string;
  name: string;
  rating: number;
  photoUrl: string;
}