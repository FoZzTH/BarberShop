import { Controller } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { changeServiceCommand, cancelCommand } from './change-service.commands';
import { noActionState, changeServiceState } from 'src/users/users.state';
import {
  changeServiceStartMessage,
  changeServiceCancelMessage,
  changeServiceAppointmentIncorrect,
  changeServiceInput,
  changeServiceSuccessful,
  changeServiceIncorrect,
} from './change-service.messages';
import { MailerService } from 'src/mailer/mailer.service';
import { from } from 'rxjs';
import {
  dateChangedSubject,
  dateChangedMessage,
  serviceChangedSubject,
  serviceChangedMessage,
} from 'src/mailer/mailer.messages';

@Controller('change-service')
export class ChangeServiceController {
  constructor(
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly mailerService: MailerService,
  ) {
    bot.onText(changeServiceCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await utils.setState(ctx, changeServiceState);

      const keyboard = await utils.getAppointmentKeyboard(ctx);
      await bot.sendMessage(ctx.chat.id, changeServiceStartMessage, keyboard);

      this.selectAppointment();
    });

    bot.onText(cancelCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, changeServiceState)) {
        return;
      }

      await appointmentsService.rollbackTransaction();
      await appointmentsService.commitTransaction();

      await utils.setState(ctx, noActionState);
      bot.removeListener('message');
      await bot.sendMessage(ctx.chat.id, changeServiceCancelMessage, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
  }

  selectAppointment() {
    bot.removeListener('message');
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.selectAppointment(ctx, 'service');

      if (success) {
        const keyboard = this.utils.getServiceKeyboard();
        bot.sendMessage(ctx.chat.id, changeServiceInput, keyboard);

        this.setService();

        return;
      }

      const keyboard = await this.utils.getAppointmentKeyboard(ctx);
      bot.sendMessage(ctx.chat.id, changeServiceAppointmentIncorrect, keyboard);
    });
  }

  setService() {
    bot.removeListener('message');
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.changeAppointment(
        ctx,
        this.utils.checkService,
        'service',
        ctx.text,
        serviceChangedSubject,
        serviceChangedMessage,
      );

      if (success) {
        bot.removeListener('message');
        await bot.sendMessage(ctx.chat.id, changeServiceSuccessful, {
          reply_markup: {
            remove_keyboard: true,
          },
        });

        return;
      }

      const keyboard = this.utils.getServiceKeyboard();
      bot.sendMessage(ctx.chat.id, changeServiceIncorrect, keyboard);
    });
  }
}
