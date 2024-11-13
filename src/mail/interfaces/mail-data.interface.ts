import { Address } from 'nodemailer/lib/mailer';

export interface MailData {
  from: Address;
  to: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholder?: { [key: string]: string };
}
