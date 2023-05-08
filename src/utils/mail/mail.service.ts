import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
/**
 * A utility class to send emails.
 */
@Injectable()
export class EmailService {
  /**
   * class constructor
   * @param mailService Mailer Service
   */
  constructor(private mailService: MailerService) {}

  /**
   * A utility function to send emails with variable user email, subject, and body.
   *
   * @param toMail The user email that will be sent to.
   * @param subject The email subject.
   * @param body The email body.
   * @returns Status code OK if sent successfully otherwise UNAUTHORIZED
   */
  sendEmail = async (toMail: string, subject: string, body: string) => {
    try {
      return this.mailService.sendMail({
        to: toMail,
        from: process.env.EMAIL_USER,
        subject,
        text: body,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to send mail',
      );
    }
  };
}
