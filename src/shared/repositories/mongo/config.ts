import mongoose from 'mongoose';
import { InternalServerError } from '../../errors/internal-server-error.js';

export async function mongooseConnect() {
  const mongoConnectionUrl = process.env.MONGO_CONNECTION_URL;

  if (!mongoConnectionUrl) {
    throw new InternalServerError('Erro ao iniciar o MongoDB');
  }

  await mongoose.connect(mongoConnectionUrl);
}
