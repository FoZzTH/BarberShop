process.env.NTBA_FIX_319 = '1';

import * as TelegramBot from 'node-telegram-bot-api';

import { env } from '../env';

export const bot = new TelegramBot(env.bot.token, { polling: true });
