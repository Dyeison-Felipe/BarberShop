import { compareSync, hashSync } from "bcrypt";
import { HashService } from "../hash-service.js";

export class HashBcryptService implements HashService {
  compareHash(passwordCompare: string, passwordEncrypted: string): boolean {
    return compareSync(passwordCompare, passwordEncrypted);
  }

  generateHash(password: string): string {
    const salts = process.env.ENCRYPTION_SALTS;
    console.log("🚀 ~ EncryptionImpl ~ generateHash ~ salts:", salts);

    if (!salts) {
      throw new Error(`Erro ao gerar senha`);
    }

    return hashSync(password, +salts);
  }
}
