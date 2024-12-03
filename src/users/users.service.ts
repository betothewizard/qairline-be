import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailService,
  ) {}
  async create(userDto: UsersDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email đã tồn tại. Vui lòng sử dụng email khác.',
      );
    }
    const salt = await bcrypt.genSalt();
    userDto.password = await bcrypt.hash(userDto.password, salt);

    const user = this.userRepository.create(userDto);
    return this.userRepository.save(user);
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'Email đã tồn tại. Vui lòng sử dụng email khác.',
      );
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    const token = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(token);

    const userEntity = this.userRepository.create(user);

    try {
      // Chờ và kiểm tra việc gửi email
      await this.mailService.sendUserConfirmation(userEntity, token);

      // Nếu email gửi thành công, mới lưu người dùng
      return this.userRepository.save(userEntity);
    } catch (error) {
      // Nếu gửi email thất bại, ném lỗi và không tạo người dùng
      console.error('Failed to send email:', error);
      throw new Error('Gửi email thất bại. Vui lòng thử lại.');
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id: id.toString() });
  }

  async update(id: number, notesDto: UsersDto): Promise<UserEntity> {
    await this.userRepository.update(id, notesDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
