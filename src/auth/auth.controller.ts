import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Response() res, @Body() signUpDto: SignUpDto) {
    return this.authService.signUp(res, signUpDto);
  }

  @Post('login')
  async login(@Response() res, @Body() loginDto: LoginDto) {
    return this.authService.login(res, loginDto);
  }

  @Post('refresh')
  async refreshTokens(@Response() res, @Body() refreshToken: string) {
    return this.authService.refreshTokens(refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verifyToken() {
    return { message: 'Token is valid' };
  }
}
