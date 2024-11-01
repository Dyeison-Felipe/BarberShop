import { Client } from '../../core/client/entities/client.entity.js';

export type GenerateJwtToken = {
  token: string;
};

export type Options = {
  expiresIn: string | number;
};

export type Payload = Record<string, unknown>;

export interface JwtService {
  generateJwt<P extends Payload>(
    payload: P,
    secret: string,
    options: Options,
  ): GenerateJwtToken;

  verifyJwt(token: string, secret: string): boolean;

  decodeJwt<P extends Payload>(token: string): P;
}
