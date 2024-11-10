import { model, Schema } from 'mongoose';

const clientSchema = new Schema({
  _id: String,
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  photoUrl: String,
});

export const ClientSchema = model('client', clientSchema);
