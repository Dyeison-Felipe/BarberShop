export interface HashService {
  compareHash(passwordCompare: string, passwordEncrypted: string): boolean;

  generateHash(password: string): string;
}
