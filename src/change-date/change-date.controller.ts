import { Controller } from '@nestjs/common';
import { bot } from 'src/bot';
import { changeDateCommand, cancelCommand } from './change-date.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { UtilsService } from 'src/utils/utils.service';
import { noActionState, changeDateState } from 'src/users/users.state';
import {
  changeDateStartMessage,
  changeDateIncorrect,
  changeDateSuccessful,
  changeDateCancelMessage,
  changeDateInput,
} from './change-date.messages';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { MailerService } from 'src/mailer/mailer.service';
import {
  from,
  dateChangedSubject,
  dateChangedMessage,
} from 'src/mailer/mailer.messages';
import { ChangeDateService } from './change-date.service';

@Controller('change-date')
export class ChangeDateController {
  constructor(
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly mailerService: MailerService,
    private readonly changeDateService: ChangeDateService,
  ) {
    bot.onText(changeDateCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await utils.setState(ctx, changeDateState);

      const keyboard = await utils.getAppointmentKeyboard(ctx);
      await bot.sendMessage(ctx.chat.id, changeDateStartMessage, keyboard);

      this.selectAppointment();
    });

    bot.onText(cancelCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, changeDateState)) {
        return;
      }

      await appointmentsService.rollbackTransaction();
      await appointmentsService.commitTransaction();

      await utils.setState(ctx, noActionState);
      bot.removeListener('message');
      await bot.sendMessage(ctx.chat.id, changeDateCancelMessage, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
  }

  selectAppointment() {
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.selectAppointment(ctx, 'date');

      if (success) {
        bot.sendMessage(ctx.chat.id, changeDateInput, {
          reply_markup: {
            remove_keyboard: true,
          },
        });
        this.setDate();

        return;
      }

      const keyboard = await this.utils.getAppointmentKeyboard(ctx);
      bot.sendMessage(ctx.chat.id, changeDateIncorrect, keyboard);
    });
  }

  setDate() {
    bot.removeListener('message');
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.changeAppointment(
        ctx,
        this.utils.checkDate,
        'date',
        ctx.text,
        dateChangedSubject,
        dateChangedMessage,
      );

      if (success) {
        bot.removeListener('message');
        await bot.sendMessage(ctx.chat.id, changeDateSuccessful);

        return;
      }

      bot.sendMessage(ctx.chat.id, changeDateIncorrect);
    });
  }
}
