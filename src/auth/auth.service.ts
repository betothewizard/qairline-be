import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/tokens/tokens.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from 'src/common/Enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private mailService: MailService,
    private userService: UserService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const { passWord, ...result } = user;
    // return result;
    return user;
  }

  async generateTokens(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '5m',
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

  async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
    const { fullName, email, password } = signUpDto;
    const newUser = new UserEntity();
    newUser.fullName = fullName;
    newUser.email = email;
    newUser.password = password;
    newUser.role = Role.User; // Thiết lập vai trò mặc định là User
    // Lưu vào cơ sở dữ liệu
    return this.userService.createUser(newUser);
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
        { sub: user.id, email: user.email },
        { expiresIn: '5m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
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
