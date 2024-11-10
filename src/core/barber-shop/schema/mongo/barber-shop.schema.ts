import { model, Schema } from 'mongoose';

const barberShopSchema = new Schema({
  _id: String,
  name: String,
  cnpj: String,
  cep: String,
  number: String,
  neighborhood: String,
  city: String,
  street: String,
  state: String,
  phone: String,
  rating: Number,
  photoUrl: String,
  clientId: String,
});

export const BarberShopSchema = model('barber_shop', barberShopSchema);
