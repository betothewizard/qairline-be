import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
//import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const mailHost = config.get('MAIL_HOST');
        const mailUser = config.get('MAIL_USER');
        const mailFrom = config.get('MAIL_FROM');

        return {
          transport: {
            host: mailHost,
            port: config.get('MAIL_PORT') || 587,
            auth: {
              user: mailUser,
              pass: config.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${mailFrom}>`,
          },
          template: {
            dir: process.cwd() + '/src/mail/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
