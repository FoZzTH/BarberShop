import { Controller, Inject, forwardRef } from '@nestjs/common';
import { NewAppointmentService } from './new-appointment.service';

import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';

import { cancelCommand } from './new-appointment.commands';
import {
  newStartMessage,
  emailIncorrect,
  emailCorrect,
  serviceCorrect,
  serviceIncorrect,
  dateCorrect,
  dateIncorrect,
  masterCorrect,
  masterIncorrect,
  emailInput,
  serviceInput,
  dateInput,
  masterInput,
  appointmentCreated,
  cancelMessage,
  errorMessage,
} from './new-appointment.messages';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IAppointments } from 'src/appointments/appointments.interface';
import { UtilsService } from 'src/utils/utils.service';
import { AppController } from 'src/app/app.controller';

@Controller('new-appointment')
export class NewAppointmentController {
  constructor(
    @Inject(forwardRef(() => AppController))
    private readonly appController: AppController,
    private readonly newAppointmentService: NewAppointmentService,
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async enterNewAppointmentScene(ctx: ITelCtx) {
    bot.removeListener('message');

    await this.newAppointmentStart(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
      try {
        if (ctx.text.match(cancelCommand)) {
          await this.cancelCommand(ctx);
        } else {
          await this.newAppointment(ctx);
        }
      } catch (err) {
        console.log({
          name: err.name,
          message: err.message,
        });

        bot.sendMessage(ctx.chat.id, errorMessage);
        this.cancelCommand(ctx);
      }
    });
  }

  private async cancelCommand(ctx: ITelCtx) {
    await this.appointmentsService.clear(ctx);

    bot.sendMessage(ctx.chat.id, cancelMessage, {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    this.appController.enterMainMenuScene();
  }

  private async newAppointmentStart(ctx: ITelCtx) {
    const appointment: IAppointments = {
      date: null,
      email: null,
      masters_id: null,
      service: null,
      user_id: ctx.from.id,
    };

    await this.appointmentsService.beginTransaction();
    await this.appointmentsService.create(appointment);

    await bot.sendMessage(ctx.chat.id, newStartMessage);
    await bot.sendMessage(ctx.chat.id, emailInput);
  }

  private async newAppointment(ctx: ITelCtx) {
    const appointment = await this.appointmentsService.findWereColumnNull(
      ctx,
      'masters_id',
    );

    if (!appointment) {
      console.log(await this.appointmentsService.findAll());
    }

    if (!appointment.email) {
      this.setEmail(ctx, appointment);
    } else if (!appointment.service) {
      this.setService(ctx, appointment);
    } else if (!appointment.date) {
      this.setDate(ctx, appointment);
    } else if (!appointment.masters_id) {
      this.setMaster(ctx, appointment);
    }
  }

  private async setEmail(ctx: ITelCtx, appointment: IAppointments) {
    const isEmailValid = await this.newAppointmentService.checkEmail(ctx);

    if (isEmailValid) {
      await this.appointmentsService.update(appointment.id, 'email', ctx.text);

      await bot.sendMessage(ctx.chat.id, emailCorrect);

      await bot.sendMessage(
        ctx.chat.id,
        serviceInput,
        this.utils.getServiceKeyboard(),
      );

      return;
    }

    bot.sendMessage(ctx.chat.id, emailIncorrect);
  }

  private async setService(ctx: ITelCtx, appointment: IAppointments) {
    const isServiceValid = await this.utils.checkService(ctx);

    if (isServiceValid) {
      await this.appointmentsService.update(
        appointment.id,
        'service',
        ctx.text,
      );

      await bot.sendMessage(ctx.chat.id, serviceCorrect);

      await bot.sendMessage(ctx.chat.id, dateInput);

      return;
    }

    bot.sendMessage(ctx.chat.id, serviceIncorrect);
  }

  private async setDate(ctx: ITelCtx, appointment: IAppointments) {
    const isDateValid = await this.utils.checkDate(ctx);

    if (isDateValid) {
      await this.appointmentsService.update(appointment.id, 'date', ctx.text);

      await bot.sendMessage(ctx.chat.id, dateCorrect);

      await bot.sendMessage(
        ctx.chat.id,
        masterInput,
        await this.utils.getMastersKeyboard(),
      );

      return;
    }

    bot.sendMessage(ctx.chat.id, dateIncorrect);
  }

  private async setMaster(ctx: ITelCtx, appointment: IAppointments) {
    const isMasterValid = await this.utils.checkMaster(ctx);
    const masterId = this.utils.getId(ctx.text);

    if (isMasterValid) {
      await this.appointmentsService.update(
        appointment.id,
        'masters_id',
        masterId,
      );

      await this.appointmentsService.clear(ctx);

      await bot.sendMessage(ctx.chat.id, masterCorrect);
      await bot.sendMessage(ctx.chat.id, appointmentCreated);

      this.appController.enterMainMenuScene();

      return;
    }

    const keyboard = await this.utils.getMastersKeyboard();
    bot.sendMessage(ctx.chat.id, masterIncorrect, keyboard);
  }
}
