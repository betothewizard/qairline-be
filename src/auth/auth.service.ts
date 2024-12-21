import { Injectable, UnauthorizedException, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/tokens/tokens.service';
import { UserService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from 'src/common/Enum/role.enum';
import { MailService } from 'src/mail/mail.service';
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
      expiresIn: '7d', // Refresh token có thể tồn tại lâu hơn
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

  async login(@Response() res, loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const { accessToken, refreshToken } = await this.generateTokens(user);

    // Set cookies cho accessToken và refreshToken
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Giúp bảo vệ cookie khỏi XSS
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
      maxAge: 5 * 60 * 1000, // Thời gian hết hạn của accessToken (5 phút)
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Giúp bảo vệ cookie khỏi XSS
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian hết hạn của refreshToken (7 ngày)
    });

    return res.json({
      userId: user.id, // Trả về userId
    });
  }

  async signUp(@Response() res, signUpDto: SignUpDto): Promise<UserEntity> {
    const { fullName, email, password } = signUpDto;
    const newUser = new UserEntity();
    newUser.fullName = fullName;
    newUser.email = email;
    newUser.password = password;
    newUser.role = Role.User; // Thiết lập vai trò mặc định là User

    // Lưu vào cơ sở dữ liệu
    await this.userService.createUser(newUser);

    // Gọi lại login để set cookie sau khi đăng ký
    return this.login(res, { email, password });
  }

  async refreshTokens(
    refreshToken: string,
    @Response() res,
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
        { expiresIn: '7d' },
      );

      await this.refreshTokenService.saveToken(
        user,
        newRefreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );

      // Set lại cookies với các token mới
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000, // 5 phút
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
