import { Controller, Inject, forwardRef } from '@nestjs/common';
import { bot } from 'src/bot';
import { UtilsService } from 'src/utils/utils.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { cancelCommand } from './change-master.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import {
  changeMasterStartMessage,
  changeMasterInput,
  changeMasterIncorrect,
  changeMasterSuccessful,
  changeMasterCancelMessage,
  errorMessage,
} from './change-master.messages';
import {
  masterChangedSubject,
  masterChangedMessage,
} from 'src/mailer/mailer.messages';
import { AppController } from 'src/app/app.controller';
import { IAppointments } from 'src/appointments/appointments.interface';

@Controller('change-master')
export class ChangeMasterController {
  private column: string;

  constructor(
    @Inject(forwardRef(() => AppController))
    private readonly appController: AppController,
    private readonly utils: UtilsService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    this.column = 'masters_id';
  }

  async enterChangeMasterState(ctx: ITelCtx) {
    bot.removeListener('message');

    await this.changeMasterStart(ctx);

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

  private async changeMasterStart(ctx: ITelCtx) {
    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    await bot.sendMessage(ctx.chat.id, changeMasterStartMessage, keyboard);
  }

  private async cancelCommand(ctx: ITelCtx) {
    await this.appointmentsService.rollbackTransaction();
    await this.appointmentsService.commitTransaction();

    await bot.sendMessage(ctx.chat.id, changeMasterCancelMessage, {
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
      this.setMaster(ctx, appointment);
    } else {
      this.selectAppointment(ctx);
    }
  }

  private async selectAppointment(ctx: ITelCtx) {
    const success = await this.utils.selectAppointment(ctx, this.column);

    if (success) {
      const keyboard = await this.utils.getMastersKeyboard();
      bot.sendMessage(ctx.chat.id, changeMasterInput, keyboard);

      return;
    }

    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    bot.sendMessage(ctx.chat.id, changeMasterIncorrect, keyboard);
  }

  private async setMaster(ctx: ITelCtx, appointment: IAppointments) {
    const success = await this.utils.changeAppointment(
      ctx,
      appointment,
      this.utils.checkMaster,
      this.column,
      this.utils.getId(ctx.text),
      masterChangedSubject,
      masterChangedMessage,
    );

    if (success) {
      await bot.sendMessage(ctx.chat.id, changeMasterSuccessful);
      this.appController.enterMainMenuScene();

      return;
    }

    const keyboard = await this.utils.getMastersKeyboard();
    bot.sendMessage(ctx.chat.id, changeMasterIncorrect, keyboard);
  }
}
