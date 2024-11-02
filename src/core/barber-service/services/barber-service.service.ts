type UpsertBarberServiceInput = {
  name: string;
  price: number;
  duration: number;
};

export type CreateBarberServiceInput = UpsertBarberServiceInput & {
  barberShopId: string;
};

export type UpdateBarberServiceInput = UpsertBarberServiceInput & {
  id: string;
};

export type BarberServiceOutput = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barberShopId: string;
};

export interface BarberServiceService {
  getBarberShopServiceId(barberShopId: string): Promise<BarberServiceOutput[]>;

  createBarberService(
    createBarberServiceInput: CreateBarberServiceInput,
  ): Promise<BarberServiceOutput>;

  updateBarberService(
    updateBarberServiceInput: UpdateBarberServiceInput,
  ): Promise<BarberServiceOutput>;
}
