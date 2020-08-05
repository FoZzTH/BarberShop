import { Controller } from '@nestjs/common';
import { NewAppointmentService } from './new-appointment.service';

import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { UsersService } from 'src/users/users.service';

import { newCommand, cancelCommand } from './new-appointment.commands';
import { noActionState, newAppointmentState } from 'src/users/users.state';
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
} from './new-appointment.messages';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IAppointments } from 'src/appointments/appointments.interface';
import { UtilsService } from 'src/utils/utils.service';

@Controller('new-appointment')
export class NewAppointmentController {
  constructor(
    private readonly newAppointmentService: NewAppointmentService,
    private readonly utils: UtilsService,
    private readonly usersService: UsersService,
    private readonly appointmentService: AppointmentsService,
  ) {
    bot.onText(newCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await utils.setState(ctx, newAppointmentState);

      await bot.sendMessage(ctx.chat.id, newStartMessage);
      await bot.sendMessage(ctx.chat.id, emailInput);

      this.setEmail();
    });

    bot.onText(cancelCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, newAppointmentState)) {
        return;
      }
      await utils.setState(ctx, noActionState);

      await appointmentService.clear(ctx);

      bot.sendMessage(ctx.chat.id, cancelMessage, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
  }

  setEmail() {
    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, newAppointmentState)) {
        return;
      }

      const isEmailValid = await this.newAppointmentService.checkEmail(ctx);

      if (isEmailValid) {
        bot.removeListener('message');

        const appointment: IAppointments = {
          date: null,
          email: ctx.text,
          masters_id: null,
          service: null,
          user_id: ctx.from.id,
        };

        if (await this.appointmentService.create(appointment)) {
          await bot.sendMessage(ctx.chat.id, emailCorrect);

          await bot.sendMessage(
            ctx.chat.id,
            serviceInput,
            this.utils.getServiceKeyboard(),
          );
          this.setService();

          return;
        }
      }

      bot.sendMessage(ctx.chat.id, emailIncorrect);
    });
  }

  setService() {
    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, newAppointmentState)) {
        return;
      }

      const isServiceValid = await this.utils.checkService(ctx);

      if (isServiceValid) {
        bot.removeListener('message');

        const appointment = await this.appointmentService.findWereColumnNull(
          ctx,
          'masters_id',
        );
        await this.appointmentService.update(
          appointment.id,
          'service',
          ctx.text,
        );

        await bot.sendMessage(ctx.chat.id, serviceCorrect);

        await bot.sendMessage(ctx.chat.id, dateInput);
        this.setDate();

        return;
      }

      bot.sendMessage(ctx.chat.id, serviceIncorrect);
    });
  }

  setDate() {
    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, newAppointmentState)) {
        return;
      }

      const isDateValid = await this.utils.checkDate(ctx);

      if (isDateValid) {
        bot.removeListener('message');

        const appointment = await this.appointmentService.findWereColumnNull(
          ctx,
          'masters_id',
        );
        await this.appointmentService.update(appointment.id, 'date', ctx.text);

        await bot.sendMessage(ctx.chat.id, dateCorrect);

        await bot.sendMessage(
          ctx.chat.id,
          masterInput,
          await this.utils.getMastersKeyboard(),
        );
        this.setMaster();

        return;
      }

      bot.sendMessage(ctx.chat.id, dateIncorrect);
    });
  }

  setMaster() {
    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, newAppointmentState)) {
        return;
      }

      const isMasterValid = await this.utils.checkMaster(ctx);
      const masterId = this.utils.getId(ctx.text);

      if (isMasterValid) {
        bot.removeListener('message');

        const appointment = await this.appointmentService.findWereColumnNull(
          ctx,
          'masters_id',
        );
        await this.appointmentService.update(
          appointment.id,
          'masters_id',
          masterId,
        );
        await this.appointmentService.clear(ctx);

        await bot.sendMessage(ctx.chat.id, masterCorrect);
        await bot.sendMessage(ctx.chat.id, appointmentCreated);

        await this.utils.setState(ctx, noActionState);
      } else {
        const keyboard = await this.utils.getMastersKeyboard();
        bot.sendMessage(ctx.chat.id, masterIncorrect, keyboard);
      }
    });
  }
}
