import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Post,
  Valid,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { LoginDto } from '../dto/login.dto.js';
import { AuthService } from '../services/auth.service.js';

@Controller('/api/auth/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    _: Request,
    res: Response,
    @Valid(LoginDto) @Body() login: LoginDto,
  ) {
    const loginOutput = await this.authService.login(login);

    res.cookie('token', loginOutput.token, {
      maxAge: Number(process.env.AUTH_COOKIES_EXPIRES_IN),
      httpOnly: true,
    });

    return loginOutput;
  }
}
