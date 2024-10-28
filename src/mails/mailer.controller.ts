import { Controller, Post } from '@nestjs/common';
import { MailData } from 'src/mails/interfaces/mail-data.interface';
import { MailerService } from 'src/mails/mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail() {
    const mail: MailData = {
      from: { name: 'Nguyen Khanh', address: '895e8357cacab7' },
      to: [{ name: 'Nguyen Van A', address: 'betothewizard@gmail.com' }],
      subject: 'Test',
      html: '<h1>Test</h1>',
    };
    return this.mailerService.sendEmail(mail);
  }
}
