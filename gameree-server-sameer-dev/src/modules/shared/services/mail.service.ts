import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailServices {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(to, text, html = '', sub): Promise<any> {
    this.mailerService
      .sendMail({
        to: to, // list of receivers
        from: 'no-reply@gameree.net', // sender address
        subject: sub, // Subject line
        text: text, // plaintext body
        html: html, // HTML body content
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

}
