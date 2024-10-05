import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from '../../../../serviceAccountKey.json'


initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
