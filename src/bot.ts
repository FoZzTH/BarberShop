import { Telegraf, session } from 'telegraf';
import { Stage } from 'telegraf';

const { leave } = Stage;

import { env } from './env';
import { appointmentScene, startScene } from './scenes/';
import { cancel } from './consts/commands/sceneSwap.commands';
import { logger } from './middlewares/logger.middleware';
import { errorHandler } from './utils/errorHandler.utils';

export const bot = new Telegraf(env.bot.token);

const stage = new Stage([appointmentScene, startScene]);
stage.command(cancel, leave());

bot.use(session());
bot.use(stage.middleware());
bot.use(logger);
bot.catch(errorHandler);

bot.launch();
