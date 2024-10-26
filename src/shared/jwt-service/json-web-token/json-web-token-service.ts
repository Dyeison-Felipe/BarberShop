import { GenerateJwtToken, JwtService, Options, Payload } from "../jwt-service.js";
import jwt from "jsonwebtoken";

export class JsonWebTokenService implements JwtService {
  generateJwt<P extends Payload>(payload: P, secret: string, options: Options ): GenerateJwtToken {
    const token = jwt.sign(
      payload,
      secret,
      options
    );

    return {token};
  }
  verifyJwt(token: string, secret: string): boolean {
    const isJwtValid = jwt.verify(
      token,
      secret,
    )

    return !!isJwtValid;
  }
}
