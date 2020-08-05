import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { env } from '../env';

@Injectable()
export class MailerService {
  private readonly mailTransport: any;

  constructor() {
    this.mailTransport = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: { user: env.app.email.login, pass: env.app.email.pass },
      tls: { rejectUnauthorized: false },
    });
  }

  send(email, from, subject, message) {
    this.mailTransport.sendMail(
      {
        from: from,
        to: email,
        subject: subject,
        text: message,
      },
      function(err, info) {},
    );
  }
}
