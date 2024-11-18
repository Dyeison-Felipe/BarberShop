import exp from 'constants';
import { HashService } from '../../../../shared/hash-service/hash-service.js';
import { JwtService } from '../../../../shared/jwt-service/jwt-service.js';
import { ClientRepository } from '../../../client/repositories/client.repository.js';
import {
  AuthService,
  CookieOptions,
  LoginInput,
  LoginOutput,
  LoginPayload,
  SetCookie,
} from '../auth.service.js';
import { BadRequestError } from '../../../../shared/errors/bad-request-error.js';
import { InternalServerError } from '../../../../shared/errors/internal-server-error.js';

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    loginInput: LoginInput,
    setCookie: SetCookie,
  ): Promise<LoginOutput> {
    const client = await this.clientRepository.getClientByEmail(
      loginInput.email,
    );

    if (!client || client?.isDeleted) {
      throw new BadRequestError('email ou senha inválidos');
    }

    const isPasswordValid = this.hashService.compareHash(
      loginInput.password,
      client.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestError('email ou senha inválidos');
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new InternalServerError('jwtSecret inválido');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN;

    if (!expiresIn) {
      throw new InternalServerError('expiresIn invalido');
    }

    const { token } = this.jwtService.generateJwt<LoginPayload>(
      { id: client.id },
      jwtSecret,
      { expiresIn },
    );

    const { password, email, ...clientOutput } = client.toJSON();
    console.log('🚀 ~ AuthServiceImpl ~ clientOutput:', clientOutput);

    setCookie('token', token, {
      maxAge: Number(process.env.AUTH_COOKIES_EXPIRES_IN),
      httpOnly: true,
    });

    return { client: clientOutput };
  }
}
