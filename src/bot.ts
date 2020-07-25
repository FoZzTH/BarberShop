import * as TelegramBot from 'node-telegram-bot-api';

import { botConfig } from './configs/bot.config';
import { env } from './env';

const botToken = env.bot.token;

export default new TelegramBot(botToken, botConfig);
