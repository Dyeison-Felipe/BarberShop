import { model, Schema } from 'mongoose';

const barberServiceSchema = new Schema({
  _id: String,
  name: String,
  price: Number,
  duration: Number,
  barberShopId: String,
});

export const BarberServiceSchema = model('barber_service', barberServiceSchema);
