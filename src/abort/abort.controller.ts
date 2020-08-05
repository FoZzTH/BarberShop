import { Controller } from '@nestjs/common';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { bot } from 'src/bot';
import { abortCommand, cancelCommand } from './abort.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { abortAppointmentState, noActionState } from 'src/users/users.state';
import { UsersService } from 'src/users/users.service';
import {
  abortStartMessage,
  cancelMessage,
  badInput,
  abortSuccess,
} from './abort.messages';
import { AbortService } from './abort.service';
import { UtilsService } from 'src/utils/utils.service';
import { MailerService } from 'src/mailer/mailer.service';
import { from } from 'rxjs';
import {
  appointmentDeletedSubject,
  appointmentDeletedMessage,
} from 'src/mailer/mailer.messages';

@Controller('abort')
export class AbortController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
    private readonly abortService: AbortService,
    private readonly appointmentsService: AppointmentsService,
    private readonly mailerService: MailerService,
  ) {
    bot.onText(abortCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await utils.setState(ctx, abortAppointmentState);

      const keyboard = await this.utils.getAppointmentKeyboard(ctx);
      await bot.sendMessage(ctx.chat.id, abortStartMessage, keyboard);
    });

    bot.onText(cancelCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, abortAppointmentState)) {
        return;
      }

      bot.removeListener('message');
      bot.sendMessage(ctx.chat.id, cancelMessage, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      await utils.setState(ctx, noActionState);
    });

    bot.on('message', async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, abortAppointmentState)) {
        return;
      }

      const success = await this.abortService.abort(ctx);

      if (success) {
        bot.removeListener('message');
        bot.sendMessage(ctx.chat.id, abortSuccess, {
          reply_markup: {
            remove_keyboard: true,
          },
        });

        return;
      }

      const keyboard = await this.utils.getAppointmentKeyboard(ctx);
      bot.sendMessage(ctx.chat.id, badInput, keyboard);
    });
  }
}
