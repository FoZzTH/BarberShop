import { NestFactory } from '@nestjs/core';
import { BotModule } from './modules/bot.module';

import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  await app.listen(env.app.port);
}

bootstrap();
