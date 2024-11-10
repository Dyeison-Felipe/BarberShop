import mongoose from 'mongoose';

export async function mongooseConnect() {
  const mongoConnectionUrl = process.env.MONGO_CONNECTION_URL;

  if (!mongoConnectionUrl) {
    throw new Error('Erro ao iniciar o MongoDB');
  }

  await mongoose.connect(mongoConnectionUrl);
}
