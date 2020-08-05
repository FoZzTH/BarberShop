import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { bot } from 'src/bot';
import { ITelCtx } from 'src/interfaces/ctx.interface';

import {
  startCommand,
  helpCommand,
  listCommand,
  oldCommand,
  viewCommand,
  procCommand,
} from './app.commands';
import { helpMessage, startMessage } from './app.messages';
import { UsersService } from 'src/users/users.service';
import { noActionState } from 'src/users/users.state';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { UtilsService } from 'src/utils/utils.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly utils: UtilsService,
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
  ) {
    bot.onText(startCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      await bot.sendMessage(ctx.from.id, startMessage);
      await bot.sendMessage(ctx.from.id, helpMessage);
    });

    bot.onText(helpCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      bot.sendMessage(ctx.from.id, helpMessage);
    });

    bot.onText(listCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      const appointments = await this.appointmentsService.getList(ctx);

      bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
    });

    bot.onText(oldCommand, async (ctx: ITelCtx) => {
      if (await utils.isUserNotAtState(ctx, noActionState)) {
        return;
      }

      const appointments = await this.appointmentsService.getOldList(ctx);

      bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
    });

    bot.onText(viewCommand, async (ctx: ITelCtx) => {
      const appointments = await this.appointmentsService.getFromView();

      bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
    });

    bot.onText(procCommand, async (ctx: ITelCtx, params: Array<string>) => {
      const appointments = await this.appointmentsService.getFromProc(
        params[1],
      );

      bot.sendMessage(ctx.from.id, JSON.stringify(appointments, null, 4));
    });
  }
}
