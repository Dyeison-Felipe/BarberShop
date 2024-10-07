import admin, { ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const config: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert(config),
});

const db = getFirestore();

export { db, admin };
