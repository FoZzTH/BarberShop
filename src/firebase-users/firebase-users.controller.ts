import { Controller } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UtilsService } from 'src/utils/utils.service';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import { usersState } from 'src/users/users.state';
import { bot } from 'src/bot';
import { cancelCommand } from 'src/abort/abort.commands';
import { helpCommand } from 'src/app/app.commands';
import { findAllCommand } from 'src/users/users.commands';
import { usersCancelMessage, usersHelpMessage } from 'src/firebase-users/firebase-users.messages';
import { defaultMessage } from 'src/app/app.messages';

@Controller('firebase-users')
export class FirebaseUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly utils: UtilsService,
  ) {}

  async enterUserScene(ctx: ITelCtx) {
    await this.utils.changeUserStateTo(ctx, usersState);

    this.helpCommand(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, usersState)) {
        return;
      }

      if (ctx.text.match(cancelCommand)) {
        await this.cancelCommand(ctx);
      } else if (ctx.text.match(helpCommand)) {
        await this.helpCommand(ctx);
      } else if (ctx.text.match(findAllCommand)) {
        await this.findAll(ctx);
      } else {
        await this.defaultMessage(ctx);
      }
    });
  }

  private async cancelCommand(ctx: ITelCtx) {
    await bot.sendMessage(ctx.chat.id, usersCancelMessage);
    this.utils.enterMainMenuScene(ctx);
  }

  private async helpCommand(ctx: ITelCtx) {
    await bot.sendMessage(ctx.chat.id, usersHelpMessage);
  }

  private async defaultMessage(ctx: ITelCtx): Promise<void> {
    bot.sendMessage(ctx.chat.id, defaultMessage);
  }

  private async findAll(ctx: ITelCtx) {
    const dbUsers = await this.usersService.findAll();
    await bot.sendMessage(ctx.chat.id, 'Database users:');
    await bot.sendMessage(ctx.chat.id, JSON.stringify(dbUsers, null, 4));

    const firebaseUsers = await this.usersService.firebaseFindAll();
    await bot.sendMessage(ctx.chat.id, 'Firebase users:');
    await bot.sendMessage(ctx.chat.id, JSON.stringify(firebaseUsers, null, 4));
  }
}
