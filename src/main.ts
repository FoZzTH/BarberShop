import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { env } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.app.port);
}
bootstrap();
