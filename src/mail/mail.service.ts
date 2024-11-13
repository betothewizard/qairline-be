import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendUserConfirmation(user: UserEntity, token: string) {
    const url = `example.com/Auth/confirm?token=${token}`;
    try {
      console.log('User object:', user);
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Nice App! Confirm your Email',
        template: './reset-password', // Đảm bảo có file activation.hbs trong thư mục templates
        context: {
          name: 'Huy',
          url,
        },
        attachments: [
          {
            filename: 'notiz.png',
            path: 'src/mail/templates/images/notiz.png', // Đảm bảo đường dẫn đúng với vị trí của file notiz.png
            cid: 'notiz', // Đây là id để tham chiếu đến ảnh trong email template
          },
        ],
      });
      console.log(user.email);
    } catch (error) {
      console.error(`Failed to send email`, error);
    }
  }

  async sendPasswordReset(user: UserEntity, token: string) {
    const url = `example.com/Auth/reset-password?token=${token}`;
    try {
      console.log('User object:', user);
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset Your Password',
        template: './reset-password',
        context: {
          name: user.fullName,
          url,
        },
      });
      console.log(`Password reset email sent to: ${user.email}`);
    } catch (error) {
      console.error('Failed to send password reset email', error);
    }
  }
}
