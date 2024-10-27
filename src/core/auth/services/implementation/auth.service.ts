import exp from "constants";
import { HashService } from "../../../../shared/hashService/hash-service.js";
import { JwtService } from "../../../../shared/jwt-service/jwt-service.js";
import { ClientRepository } from "../../../client/repositories/client.repository.js";
import { AuthService, LoginInput, LoginOutput, LoginPayload } from "../auth.service.js";

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginInput: LoginInput): Promise<LoginOutput> {

    const client = await this.clientRepository.getClientByEmail(loginInput.email);

    if(!client) {
      throw new Error('email ou senha invalidos')
    }

    const isPasswordValid = this.hashService.compareHash(loginInput.password, client.password);

    if(!isPasswordValid) {
      throw new Error('email ou senha invalidos')
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('jwtSecret invalido');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!expiresIn) {
      throw new Error('expiresIn invalido')
    }

    const { token } = this.jwtService.generateJwt<LoginPayload>({id: client.id}, jwtSecret, {expiresIn});

    const {password, ...clientOutput} = client.toObject();
    
    return {client: clientOutput, token }
  }
}
