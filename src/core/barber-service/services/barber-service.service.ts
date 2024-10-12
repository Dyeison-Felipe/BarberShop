export type CreateBarberServiceInput = {
  name: string;
  price: number;
  duration: number;
};

export type BarberServiceOutput = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

export interface BarberServiceService {
  createBarberService(
    createBarberServiceInput: CreateBarberServiceInput,
  ): Promise<BarberServiceOutput>;
}
