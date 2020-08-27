import { Controller, Get } from '@nestjs/common';

import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';

import {
  startCommand,
  helpCommand,
  listCommand,
  oldCommand,
  viewCommand,
  procCommand,
  abortCommand,
  changeDateCommand,
  changeMasterCommand,
  changeServiceCommand,
  newCommand,
  userCommand,
} from './app.commands';
import {
  helpMessage,
  startMessage,
  defaultMessage,
  errorMessage,
} from './app.messages';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AbortController } from 'src/abort/abort.controller';
import { ChangeDateController } from 'src/change-date/change-date.controller';
import { ChangeMasterController } from 'src/change-master/change-master.controller';
import { ChangeServiceController } from 'src/change-service/change-service.controller';
import { NewAppointmentController } from 'src/new-appointment/new-appointment.controller';
import { UsersService } from 'src/users/users.service';
import { FirebaseUsersController } from 'src/firebase-users/firebase-users.controller';
import { noActionState } from 'src/users/users.state';
import { UtilsService } from 'src/utils/utils.service';

@Controller()
export class AppController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly firebaseUsersController: FirebaseUsersController,
    private readonly usersService: UsersService,
    private readonly abortController: AbortController,
    private readonly newAppointmentController: NewAppointmentController,
    private readonly changeDateController: ChangeDateController,
    private readonly changeMasterController: ChangeMasterController,
    private readonly changeServiceController: ChangeServiceController,
    private readonly utils: UtilsService,
  ) {
    this.enterMainMenuScene();
  }

  async enterMainMenuScene() {
    bot.on('message', async (ctx: ITelCtx, params: Array<string>) => {
      await this.usersService.createIfNotEx(ctx);

      if (await this.utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      try {
        if (ctx.text.match(startCommand)) {
          await this.startCommand(ctx);
        } else if (ctx.text.match(helpCommand)) {
          await this.helpCommand(ctx);
        } else if (ctx.text.match(newCommand)) {
          await this.newCommand(ctx);
        } else if (ctx.text.match(listCommand)) {
          await this.listCommand(ctx);
        } else if (ctx.text.match(oldCommand)) {
          await this.oldCommand(ctx);
        } else if (ctx.text.match(viewCommand)) {
          await this.viewCommand(ctx);
        } else if (ctx.text.match(procCommand)) {
          await this.procCommand(ctx, params);
        } else if (ctx.text.match(abortCommand)) {
          await this.abortCommand(ctx);
        } else if (ctx.text.match(changeDateCommand)) {
          await this.changeDateCommand(ctx);
        } else if (ctx.text.match(changeMasterCommand)) {
          await this.changeMasterCommand(ctx);
        } else if (ctx.text.match(changeServiceCommand)) {
          await this.changeServiceCommand(ctx);
        } else if (ctx.text.match(userCommand)) {
          await this.usersCommand(ctx);
        } else {
          await this.defaultMessage(ctx);
        }
      } catch (err) {
        console.log({
          name: err.name,
          message: err.message,
        });

        bot.sendMessage(ctx.chat.id, errorMessage);
      }
    });
  }

  private async startCommand(ctx: ITelCtx): Promise<void> {
    await bot.sendMessage(ctx.from.id, startMessage);
    await bot.sendMessage(ctx.from.id, helpMessage);
  }

  private async helpCommand(ctx: ITelCtx): Promise<void> {
    bot.sendMessage(ctx.from.id, helpMessage);
  }

  private async newCommand(ctx: ITelCtx): Promise<void> {
    this.newAppointmentController.enterNewAppointmentScene(ctx);
  }

  private async listCommand(ctx: ITelCtx): Promise<void> {
    const appointments = await this.appointmentsService.getList(ctx);

    bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
  }

  private async oldCommand(ctx: ITelCtx): Promise<void> {
    const appointments = await this.appointmentsService.getOldList(ctx);

    bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
  }

  private async viewCommand(ctx: ITelCtx): Promise<void> {
    const appointments = await this.appointmentsService.getFromView();

    bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
  }

  private async procCommand(
    ctx: ITelCtx,
    params: Array<string>,
  ): Promise<void> {
    const appointments = await this.appointmentsService.getFromProc(params[1]);

    bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
  }

  private async defaultMessage(ctx: ITelCtx): Promise<void> {
    bot.sendMessage(ctx.chat.id, defaultMessage);
  }

  private async abortCommand(ctx: ITelCtx): Promise<void> {
    this.abortController.enterAbortScene(ctx);
  }

  private async changeDateCommand(ctx: ITelCtx): Promise<void> {
    this.changeDateController.enterChangeDateState(ctx);
  }

  private async changeMasterCommand(ctx: ITelCtx): Promise<void> {
    this.changeMasterController.enterChangeMasterState(ctx);
  }

  private async changeServiceCommand(ctx: ITelCtx): Promise<void> {
    this.changeServiceController.enterChangeServiceState(ctx);
  }

  private async usersCommand(ctx: ITelCtx) {
    this.firebaseUsersController.enterUserScene(ctx);
  }
}
