import { compareSync, hashSync } from 'bcrypt';
import { HashService } from '../hash-service.js';
import { InternalServerError } from '../../errors/internal-server-error.js';

export class HashBcryptService implements HashService {
  compareHash(passwordCompare: string, passwordEncrypted: string): boolean {
    return compareSync(passwordCompare, passwordEncrypted);
  }

  generateHash(password: string): string {
    const salts = process.env.ENCRYPTION_SALTS;
    console.log('🚀 ~ EncryptionImpl ~ generateHash ~ salts:', salts);

    if (!salts) {
      throw new InternalServerError(`Erro ao gerar senha`);
    }

    return hashSync(password, +salts);
  }
}
