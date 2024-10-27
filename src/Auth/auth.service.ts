import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/Users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { userName: loginDto.userName },
    });

    if (!user || !(await bcrypt.compare(loginDto.passWord, user.passWord))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const { passWord, ...result } = user;
    // return result;
    return user;
  }

  async generateTokens(user: UserEntity) {
    const payload = { userName: user.userName, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '10m',
    });

    await this.refreshTokenService.saveToken(
      user,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateTokens(user);
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      await this.refreshTokenService.deleteToken(refreshToken);
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, userName: user.userName },
        { expiresIn: '1m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, userName: user.userName },
        { expiresIn: '10m' },
      );
      await this.refreshTokenService.saveToken(
        user,
        newRefreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
