import { Controller } from '@nestjs/common';
import { UtilsService } from 'src/utils/utils.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { cancelCommand } from './change-service.commands';
import {
  changeServiceStartMessage,
  changeServiceCancelMessage,
  changeServiceInput,
  changeServiceSuccessful,
  changeServiceIncorrect,
  errorMessage,
} from './change-service.messages';
import {
  serviceChangedSubject,
  serviceChangedMessage,
} from 'src/mailer/mailer.messages';
import { IAppointments } from 'src/appointments/appointments.interface';
import { changeServiceState } from 'src/users/users.state';

@Controller('change-service')
export class ChangeServiceController {
  private column: string;

  constructor(
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    this.column = 'service';
  }

  async enterChangeServiceState(ctx: ITelCtx) {
    await this.utils.changeUserStateTo(ctx, changeServiceState);

    await this.changeServiceStart(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, changeServiceState)) {
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

  private async changeServiceStart(ctx: ITelCtx) {
    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    await bot.sendMessage(ctx.chat.id, changeServiceStartMessage, keyboard);
  }

  private async cancelCommand(ctx: ITelCtx) {
    await this.appointmentsService.rollbackTransaction();
    await this.appointmentsService.commitTransaction();

    await bot.sendMessage(ctx.chat.id, changeServiceCancelMessage, {
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
      this.setService(ctx, appointment);
    } else {
      this.selectAppointment(ctx);
    }
  }

  private async selectAppointment(ctx: ITelCtx) {
    const success = await this.utils.selectAppointment(ctx, this.column);

    if (success) {
      const keyboard = this.utils.getServiceKeyboard();
      bot.sendMessage(ctx.chat.id, changeServiceInput, keyboard);

      return;
    }

    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    bot.sendMessage(ctx.chat.id, changeServiceIncorrect, keyboard);
  }

  private async setService(ctx: ITelCtx, appointment: IAppointments) {
    const success = await this.utils.changeAppointment(
      ctx,
      appointment,
      this.utils.checkService,
      this.column,
      ctx.text,
      serviceChangedSubject,
      serviceChangedMessage,
    );

    if (success) {
      await bot.sendMessage(ctx.chat.id, changeServiceSuccessful);
      this.utils.enterMainMenuScene(ctx);

      return;
    }

    const keyboard = this.utils.getServiceKeyboard();
    bot.sendMessage(ctx.chat.id, changeServiceIncorrect, keyboard);
  }
}
