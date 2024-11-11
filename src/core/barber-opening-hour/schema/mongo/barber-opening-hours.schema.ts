import { model, Schema } from 'mongoose';

const barberOpeningHoursSchema = new Schema({
  _id: String,
  weekday: String,
  start: String,
  end: String,
  barberShopId: String,
});

export const BarberOpeningHoursSchema = model(
  'barber_opening_hors',
  barberOpeningHoursSchema,
);
