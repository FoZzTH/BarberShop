import { Controller } from '@nestjs/common';
import { bot } from 'src/bot';

@Controller()
export class AppController {
  constructor() {
    bot.help(ctx => {
      ctx.reply('Type /appointment');
    });

    bot.on('message', ctx => {
      ctx.reply("Don't understand, sorry.");
    });
  }
}
