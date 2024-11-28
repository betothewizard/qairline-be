import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-notification.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly notificationRepository: Repository<PostEntity>,
  ) {}

  create(createNotificationDto: CreatePostDto) {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return this.notificationRepository.save(notification);
  }

  findAll() {
    return this.notificationRepository.find();
  }

  findOne(id: string) {
    return this.notificationRepository.findOne({ where: { id } });
  }

  update(id: string, updateNotificationDto: UpdatePostDto) {
    return this.notificationRepository.update(id, updateNotificationDto);
  }

  remove(id: string) {
    return this.notificationRepository.delete(id);
  }
}
