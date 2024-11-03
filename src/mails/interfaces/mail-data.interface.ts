import { Address } from 'nodemailer/lib/mailer';

export interface MailData {
  from: Address;
  to: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholders?: { [key: string]: string };
}
