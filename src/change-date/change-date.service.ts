import { Injectable } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { MailerService } from 'src/mailer/mailer.service';
import { bot } from 'src/bot';
import { changeDateIncorrect, changeDateInput } from './change-date.messages';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { from } from 'rxjs';
import {
  dateChangedSubject,
  dateChangedMessage,
} from 'src/mailer/mailer.messages';
import { noActionState } from 'src/users/users.state';

@Injectable()
export class ChangeDateService {}
