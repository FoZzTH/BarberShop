import { Controller } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

import { BotService } from '../services/bot.service';
import { UsersService } from '../services/users.service';

import bot from '../bot';
import { BotCommand } from '../decorators/bot.command.decorator';

import { ITelRes } from 'src/interfaces/tel.res.interface';
import {
  startMessage,
  dontUnderstand,
  cancelMessage,
  chooseService,
  serviceKeyboard,
  haircutService,
  shavingService,
  haircutAndShavingService,
  enterEmail,
  hideKeyboard,
  serviceSelected,
} from '../consts/bot.const';
import {
  appointmEnterEmail,
  noAction,
  appointmChooseService,
} from '../consts/state.conts';
import { ServicesService } from 'src/services/services.service';

@Controller('bot')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly servicesService: ServicesService,
  ) {
    this.botInitCommand();
    this.botDisableCommands();
  }

  botInitCommand() {
    this.botDisableCommands();

    this.botStartCommand(null);
    this.botAppointmentCommand(null);
    this.botCancelCommand(null);
    this.botEmail();
  }

  botDisableCommands() {
    bot.removeListener(/\/start/);
  }

  @BotCommand(/\/start/)
  async botStartCommand(ctx: ITelRes) {
    if (await this.usersService.isStateNotActive(ctx, noAction)) {
      return;
    }

    bot.sendMessage(ctx.chat.id, startMessage);
  }

  @BotCommand(/\/appointment/)
  async botAppointmentCommand(ctx: ITelRes) {
    if (await this.usersService.isStateNotActive(ctx, noAction)) {
      return;
    }

    this.usersService.changeState(ctx.from.id, appointmEnterEmail);

    bot.sendMessage(ctx.chat.id, enterEmail);
    
    this.botEmail();
  }

  @BotCommand(/\/cancel/)
  async botCancelCommand(ctx: ITelRes) {
    this.usersService.changeState(ctx.from.id, noAction);

    bot.sendMessage(ctx.chat.id, cancelMessage);
  }

  botEmail() {
    bot.on('message', async (ctx: ITelRes) => {
      if (await this.usersService.isStateNotActive(ctx, appointmEnterEmail)) {
        return;
      }
      
      this.usersService.setEmail(ctx.from.id, ctx.text);
      
      this.botChooseService(ctx);

      bot.removeListener('message');
    });
  }

  async botChooseService(ctx: ITelRes) {
    bot.sendMessage(ctx.chat.id, chooseService, serviceKeyboard);
    await this.usersService.changeState(ctx.from.id, appointmChooseService);

    bot.on('message', async (ctx: ITelRes) => {
      if (
        await this.usersService.isStateNotActive(ctx, appointmChooseService)
      ) {
        return;
      }

      if (ctx.text === haircutService) {
        bot.sendMessage(ctx.chat.id, serviceSelected, hideKeyboard);

        const service = await this.servicesService.getOrCreateServiceIfNotEx(
          haircutService,
        );

        // Создать appointServices запись и привязать к appointment
      } else if (ctx.text === shavingService) {
        bot.sendMessage(ctx.chat.id, serviceSelected, hideKeyboard);

        const service = await this.servicesService.getOrCreateServiceIfNotEx(
          shavingService,
        );
      } else if (ctx.text === haircutAndShavingService) {
        bot.sendMessage(ctx.chat.id, serviceSelected, hideKeyboard);

        const services = [
          await this.servicesService.getOrCreateServiceIfNotEx(haircutService),
          await this.servicesService.getOrCreateServiceIfNotEx(shavingService),
        ];
      } else {
        this.botDontUnderstand(ctx);

        return;
      }

      // Выбор даты и времени, затем выбор мастера

      bot.removeListener('message');
    });
  }

  botDontUnderstand(ctx: ITelRes) {
    bot.sendMessage(ctx.chat.id, dontUnderstand);
  }

  // @BotCommand(/\/get/)
  // async botGetUsersCommand(ctx: ITelRes) {
  //   const users = await this.userService.findAll();

  //   bot.sendMessage(ctx.chat.id, JSON.stringify(users, null, 4));
  // }

  // @BotCommand(/\/one (.+)/)
  // async botGetOneUsersCommand(ctx: ITelRes, options: Array<string>) {
  //   const u = await this.userService.findOne({
  //     where: { id: +options[1] },
  //   });
  //   bot.sendMessage(ctx.chat.id, JSON.stringify(u, null, 4));
  // }

  // @BotCommand(/\/destroy (.+)/)
  // async botDestroyUsersCommand(ctx: ITelRes, options: Array<string>) {
  //   const u = await this.userService.destroy(+options[1]);
  //   bot.sendMessage(ctx.chat.id, JSON.stringify(u, null, 4));
  // }

  // @BotCommand(/\/create (.+)/)
  // async botCreateCommand(ctx: ITelRes) {
  //   const u = await this.userService.create(ctx);
  //   bot.sendMessage(ctx.chat.id, JSON.stringify(u, null, 4));
  // }
}
