import {
  Body,
  Controller,
  Post,
} from '../../../shared/decorators/http/request-mapping.decorator.js';
import { LoginDto } from '../dto/login.dto.js';
import { AuthService } from '../services/auth.service.js';

@Controller('/api/auth/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() login: LoginDto) {
    const loginOutput = await this.authService.login(login);

    return loginOutput;
  }
}
