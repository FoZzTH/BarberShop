import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

import { env } from './env';
import { bot } from './bot';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(env.app.port);
}

bootstrap();
