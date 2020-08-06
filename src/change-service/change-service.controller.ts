import { Controller, Inject, forwardRef } from '@nestjs/common';
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
import { AppController } from 'src/app/app.controller';

@Controller('change-service')
export class ChangeServiceController {
  private column: string;

  constructor(
    @Inject(forwardRef(() => AppController))
    private readonly appController: AppController,
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    this.column = 'service';
  }

  async enterChangeServiceState(ctx: ITelCtx) {
    bot.removeListener('message');

    await this.changeServiceStart(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
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

    this.appController.enterMainMenuScene();
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
      this.appController.enterMainMenuScene();

      return;
    }

    const keyboard = this.utils.getServiceKeyboard();
    bot.sendMessage(ctx.chat.id, changeServiceIncorrect, keyboard);
  }
}
