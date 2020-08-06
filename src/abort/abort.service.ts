import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { UtilsService } from 'src/utils/utils.service';
import { MailerService } from 'src/mailer/mailer.service';
import { from } from 'rxjs';
import {
  appointmentDeletedSubject,
  appointmentDeletedMessage,
} from 'src/mailer/mailer.messages';
import { bot } from 'src/bot';
import { abortSuccess } from './abort.messages';
import { noActionState } from 'src/users/users.state';

@Injectable()
export class AbortService {
  constructor(
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly mailerService: MailerService,
  ) {}

  async abort(ctx: ITelCtx): Promise<boolean> {
    const id = this.utils.getId(ctx.text);

    if (isNaN(+id)) {
      return false;
    }

    const appointment = await this.appointmentsService.findById(+id);
    if (!appointment) {
      return false;
    }

    await this.appointmentsService.delete(+id);
    await this.utils.setState(ctx, noActionState);

    this.mailerService.send(
      appointment.email,
      from,
      appointmentDeletedSubject,
      appointmentDeletedMessage,
    );

    return true;
  }
}
