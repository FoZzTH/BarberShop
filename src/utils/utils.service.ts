import { Injectable } from '@nestjs/common';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { AppointmentsService } from 'src/appointments/appointments.service';

import * as moment from 'moment';
import { MastersService } from 'src/masters/masters.service';
import {
  haircutService,
  shavingService,
  bothService,
} from 'src/appointments/appointments-services';
import { from } from 'src/mailer/mailer.messages';
import { MailerService } from 'src/mailer/mailer.service';
import { IAppointments } from 'src/appointments/appointments.interface';

@Injectable()
export class UtilsService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly mastersService: MastersService,
    private readonly mailerService: MailerService,
  ) {}

  getId(from: string): string {
    const regExp = /\./;
    return from.split(regExp)[0];
  }

  async getAppointmentKeyboard(ctx: ITelCtx) {
    const appointments = await this.appointmentsService.getList(ctx);

    const keyboard = {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [],
      },
    };

    const buttons: Array<Array<string>> = [];
    appointments.forEach(a => {
      const date = new Date(a.date).toISOString();
      buttons.push([`${a.id}. ${date} ${a.service}`]);
    });

    keyboard.reply_markup.keyboard = buttons;

    return keyboard;
  }

  getServiceKeyboard(): object {
    return {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [[haircutService, shavingService], [bothService]],
      },
    };
  }

  async getMastersKeyboard(): Promise<object> {
    const keyboard = {
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        keyboard: [],
      },
    };
    const buttons: Array<Array<string>> = [];

    const masters = await this.mastersService.findAll();
    masters.forEach(m => {
      buttons.push([`${m.id}. ${m.first_name} ${m.last_name}.`]);
    });

    keyboard.reply_markup.keyboard = buttons;

    return keyboard;
  }

  async checkService(ctx: ITelCtx): Promise<boolean> {
    const text = ctx.text.toLowerCase();
    return (
      text === haircutService.toLocaleLowerCase() ||
      text === shavingService.toLocaleLowerCase() ||
      text === bothService.toLocaleLowerCase()
    );
  }

  async checkDate(ctx: ITelCtx): Promise<boolean> {
    const isValidFormatAndDate = moment(
      ctx.text,
      'YYYY-MM-DD HH:mm',
      true,
    ).isValid();
    if (!isValidFormatAndDate) {
      return false;
    }

    const hour = +moment(ctx.text).format('HH');
    if (hour < 10 || hour > 21) {
      return false;
    } else if (hour == 21) {
      const minute = +moment(ctx.text).format('mm');
      if (minute > 0) {
        return false;
      }
    }

    // const date = new Date(ctx.text);

    // if (date.valueOf() < Date.now().valueOf()) {
    //   return false;
    // }

    const appointments = await this.appointmentsService.getWhereDateOverlap(
      ctx.text,
    );

    if (appointments.length > 0) {
      return false;
    }

    return true;
  }

  async checkMaster(ctx: ITelCtx): Promise<boolean> {
    const id = this.getId(ctx.text);

    if (isNaN(+id)) {
      return false;
    }

    const master = await this.mastersService.findById(+id);

    return !!master;
  }

  async selectAppointment(ctx: ITelCtx, column: string): Promise<boolean> {
    const id = this.getId(ctx.text);

    if (isNaN(+id)) {
      return false;
    }

    const appointment = await this.appointmentsService.findById(+id);
    if (!appointment) {
      return false;
    }

    await this.appointmentsService.beginTransaction();
    await this.appointmentsService.setColumnNull(appointment.id, column);

    return true;
  }

  async changeAppointment(
    ctx: ITelCtx,
    appointment: IAppointments,
    validateFunction: (ctx: ITelCtx) => Promise<boolean>,
    column: string,
    to: string,
    mailerSubject: string,
    mailerMessage: string,
  ): Promise<boolean> {
    const isValid = await validateFunction.call(this, ctx);

    if (!isValid) {
      return false;
    }

    await this.appointmentsService.update(appointment.id, column, to);
    await this.appointmentsService.commitTransaction();

    this.mailerService.send(
      appointment.email,
      from,
      mailerSubject,
      mailerMessage,
    );

    return true;
  }
}
