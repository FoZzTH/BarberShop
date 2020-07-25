import { log } from '../helpers/logger';

import bot from '../bot';
import { ITelRes } from 'src/interfaces/tel.res.interface';
import { BotController } from 'src/controllers/bot.controller';

export function BotCommand(command: RegExp) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function() {
      bot.onText(command, (ctx: ITelRes, options?: Array<string>) => {
        log(ctx);
        try {
          originalMethod.call(this, ctx, options);
        } catch (e) {
          console.log(e);
        }
      });
    };

    return descriptor;
  };
}
