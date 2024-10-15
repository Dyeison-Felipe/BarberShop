export type GetAllBarberOpeningHours = {
  id: string;
  weekday: string;
  start: string;
  end: string;
  barberShopId: string;
};

export interface BarberOpeningHoursRepository {
  getAllByBarberShopId(
    barberShopId: string,
  ): Promise<GetAllBarberOpeningHours[]>;
}
