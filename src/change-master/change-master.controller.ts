import { Controller } from '@nestjs/common';
import { bot } from 'src/bot';
import { UtilsService } from 'src/utils/utils.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { noActionState, changeMasterState } from 'src/users/users.state';
import { changeMasterCommand, cancelCommand } from './change-master.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import {
  changeMasterStartMessage,
  changeMasterInput,
  changeMasterIncorrect,
  changeMasterSuccessful,
  changeMasterAppointmentIncorrect,
  changeMasterCancelMessage,
} from './change-master.messages';
import { from } from 'rxjs';
import { MailerService } from 'src/mailer/mailer.service';
import {
  masterChangedSubject,
  masterChangedMessage,
} from 'src/mailer/mailer.messages';

@Controller('change-master')
export class ChangeMasterController {
  constructor(
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly mailerService: MailerService,
  ) {
    bot.onText(changeMasterCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await utils.setState(ctx, changeMasterState);

      const keyboard = await utils.getAppointmentKeyboard(ctx);
      await bot.sendMessage(ctx.chat.id, changeMasterStartMessage, keyboard);

      this.selectAppointment();
    });

    bot.onText(cancelCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, changeMasterState)) {
        return;
      }
      bot.removeListener('message');

      await appointmentsService.rollbackTransaction();
      await appointmentsService.commitTransaction();

      await utils.setState(ctx, noActionState);
      await bot.sendMessage(ctx.chat.id, changeMasterCancelMessage, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
    });
  }

  selectAppointment() {
    bot.removeListener('message');
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.selectAppointment(ctx, 'masters_id');

      if (success) {
        const keyboard = await this.utils.getMastersKeyboard();
        bot.sendMessage(ctx.chat.id, changeMasterInput, keyboard);

        this.setMaster();

        return;
      }

      const keyboard = await this.utils.getAppointmentKeyboard(ctx);
      bot.sendMessage(ctx.chat.id, changeMasterAppointmentIncorrect, keyboard);
    });
  }

  setMaster() {
    bot.removeListener('message');
    bot.on('message', async (ctx: ITelCtx) => {
      const success = await this.utils.changeAppointment(
        ctx,
        this.utils.checkMaster,
        'masters_id',
        this.utils.getId(ctx.text),
        masterChangedSubject,
        masterChangedMessage,
      );

      if (success) {
        bot.removeListener('message');
        await bot.sendMessage(ctx.chat.id, changeMasterSuccessful, {
          reply_markup: {
            remove_keyboard: true,
          },
        });

        return;
      }

      const keyboard = await this.utils.getMastersKeyboard();
      bot.sendMessage(ctx.chat.id, changeMasterIncorrect, keyboard);
    });
  }
}
