import { model, Schema } from 'mongoose';

const clientFavoriteListSchema = new Schema({
  _id: String,
  barberShopId: String,
  clientId: String,
});

export const ClientFavoriteListSchema = model(
  'client_favorite_list',
  clientFavoriteListSchema,
);
