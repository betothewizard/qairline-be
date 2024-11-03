import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailData } from './interfaces/mail-data.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      // secure: true for port 465, false for other ports
      secure: false,
      auth: {
        user: '22021160@vnu.edu.vn',
        pass: 'jpqtmxtwccspzawe',
      },
    });
  }

  async sendEmail(mail: MailData) {
    const { from, to, subject, html, text, placeholders } = mail;
    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return info;
  }
}
