import { Controller, forwardRef, Inject } from '@nestjs/common';
import { bot } from 'src/bot';
import { abortCommand, cancelCommand } from './abort.commands';
import { ITelCtx } from 'src/interfaces/ctx.interface';
import {
  abortStartMessage,
  cancelMessage,
  badInput,
  abortSuccess,
  errorMessage,
} from './abort.messages';
import { AbortService } from './abort.service';
import { UtilsService } from 'src/utils/utils.service';
import { abortState } from 'src/users/users.state';

@Controller('abort')
export class AbortController {
  constructor(
    private readonly utils: UtilsService,
    private readonly abortService: AbortService,
  ) {}

  async enterAbortScene(ctx: ITelCtx): Promise<void> {
    await this.utils.changeUserStateTo(ctx, abortState);

    await this.abortStart(ctx);

    bot.on('message', async (ctx: ITelCtx) => {
      if (await this.utils.isUserNotAtState(ctx, abortState)) {
        return;
      }

      try {
        if (ctx.text.match(cancelCommand)) {
          await this.cancelCommand(ctx);
        } else {
          await this.abortAppointment(ctx);
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

  private async abortStart(ctx: ITelCtx): Promise<void> {
    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    await bot.sendMessage(ctx.chat.id, abortStartMessage, keyboard);
  }

  private async cancelCommand(ctx: ITelCtx): Promise<void> {
    this.utils.enterMainMenuScene(ctx);

    bot.sendMessage(ctx.chat.id, cancelMessage, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }

  private async abortAppointment(ctx: ITelCtx): Promise<void> {
    const success = await this.abortService.abort(ctx);

    if (success) {
      this.utils.enterMainMenuScene(ctx);
      bot.sendMessage(ctx.chat.id, abortSuccess, {
        reply_markup: {
          remove_keyboard: true,
        },
      });

      return;
    }

    const keyboard = await this.utils.getAppointmentKeyboard(ctx);
    bot.sendMessage(ctx.chat.id, badInput, keyboard);
  }
}
