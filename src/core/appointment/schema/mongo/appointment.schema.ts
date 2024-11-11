import { model, Schema } from 'mongoose';

const appointmentSchema = new Schema({
  _id: String,
  barberServiceId: String,
  barberShopId: String,
  clientId: String,
  date: Date,
});

export const AppointmentSchema = model('appointment', appointmentSchema);
