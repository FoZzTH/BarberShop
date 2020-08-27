import { Controller } from '@nestjs/common';
import { bot } from 'src/bot';
import { cancelCommand } from './change-date.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { UtilsService } from 'src/utils/utils.service';
import {
  changeDateStartMessage,
  changeDateIncorrect,
  changeDateSuccessful,
  changeDateCancelMessage,
  changeDateInput,
  errorMessage,
} from './change-date.messages';
import { AppointmentsService } from 'src/appointments/appointments.service';
import {
  dateChangedSubject,
  dateChangedMessage,
} from 'src/mailer/mailer.messages';
import { IAppointments } from 'src/appointments/appointments.interface';
import { changeDateState } from 'src/users/users.state';

@Controller('change-date')
export class ChangeDateController {
  private column: string;

  constructor(
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    this.column = 'date';
  }

  async enterChangeDateState(ctx: ITelCtx) {
    await this.utils.changeUserStateTo(ctx, changeDateState);

    await this.changeDateStart(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, changeDateState)) {
        return;
      }

      try {
        if (ctx.text.match(cancelCommand)) {
          await this.cancelCommand(ctx);
        } else {
          await this.changeAppointment(ctx);
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

  private async changeDateStart(ctx: ITelCtx) {
    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    await bot.sendMessage(ctx.chat.id, changeDateStartMessage, keyboard);
  }

  private async cancelCommand(ctx: ITelCtx) {
    await this.appointmentsService.rollbackTransaction();
    await this.appointmentsService.commitTransaction();

    await bot.sendMessage(ctx.chat.id, changeDateCancelMessage, {
      reply_markup: {
        remove_keyboard: true,
      },
    });

    this.utils.enterMainMenuScene(ctx);
  }

  private async changeAppointment(ctx: ITelCtx) {
    const appointment = await this.appointmentsService.findWereColumnNull(
      ctx,
      this.column,
    );

    if (appointment) {
      this.setDate(ctx, appointment);
    } else {
      this.selectAppointment(ctx);
    }
  }

  private async selectAppointment(ctx: ITelCtx) {
    const success = await this.utils.selectAppointment(ctx, this.column);

    if (success) {
      bot.sendMessage(ctx.chat.id, changeDateInput, {
        reply_markup: {
          remove_keyboard: true,
        },
      });

      return;
    }

    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    bot.sendMessage(ctx.chat.id, changeDateIncorrect, keyboard);
  }

  private async setDate(ctx: ITelCtx, appointment: IAppointments) {
    const success = await this.utils.changeAppointment(
      ctx,
      appointment,
      this.utils.checkDate,
      this.column,
      ctx.text,
      dateChangedSubject,
      dateChangedMessage,
    );

    if (success) {
      await bot.sendMessage(ctx.chat.id, changeDateSuccessful);
      this.utils.enterMainMenuScene(ctx);

      return;
    }

    bot.sendMessage(ctx.chat.id, changeDateIncorrect);
  }
}
