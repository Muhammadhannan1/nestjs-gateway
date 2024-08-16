import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    }),
  );
  const globalPrefix = 'api/v1';

  app.setGlobalPrefix(globalPrefix);

  await app.listen(3100);
  Logger.log(
    `Server running on http://localhost:3100/${globalPrefix}`,
  );
}

bootstrap();
