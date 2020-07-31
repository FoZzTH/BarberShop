import { Controller } from '@nestjs/common';
import { bot } from 'src/bot';
import { UsersService } from 'src/services/users.service';

@Controller()
export class AppController {
  constructor(usersService: UsersService) {
    bot.help(async ctx => {
      const user = await usersService.update(ctx, 'last_name', 'Boss');
      ctx.reply(JSON.stringify(user, null, 4));
    });

    bot.on('message', async ctx => {
      ctx.reply(JSON.stringify(await usersService.findAll(), null, 4));

      // ctx.reply('Don\'t understand');
    });
  }
}
