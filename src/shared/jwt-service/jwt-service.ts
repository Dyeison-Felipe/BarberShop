import { Client } from "../../core/client/entities/client.entity.js";

export type GenerateJwtToken = {
  token: string;
};

export interface JwtService {
  generateJwt(client: Client): Promise<GenerateJwtToken>;
}