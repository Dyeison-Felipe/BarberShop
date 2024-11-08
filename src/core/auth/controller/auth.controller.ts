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
  async login(@Valid(LoginDto) @Body() login: LoginDto) {
    console.log('🚀 ~ AuthController ~ login ~ login:', login);
    const loginOutput = await this.authService.login(login);

    return loginOutput;
  }
}
