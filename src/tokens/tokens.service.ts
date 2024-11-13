import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh_token.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}
  async saveToken(user: UserEntity, token: string, expiresAt: Date) {
    const refreshToken = this.refreshTokenRepository.create({
      user,
      token,
      expiresAt,
    });
    return this.refreshTokenRepository.save(refreshToken);
  }
  async findToken(token: string) {
    return this.refreshTokenRepository.findOne({ where: { token } });
  }
  async deleteToken(token: string) {
    return this.refreshTokenRepository.delete({ token });
  }
}
