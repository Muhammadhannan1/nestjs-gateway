// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger, ValidationPipe } from '@nestjs/common';
// import { RedisIoAdapter } from 'utils/middlewares/redisAdapter';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const redisIoAdapter = new RedisIoAdapter(app);
//   await redisIoAdapter.connectToRedis();

//   app.useWebSocketAdapter(redisIoAdapter);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       validationError: { target: false },
//     }),
//   );
//   const globalPrefix = 'api/v1';

//   app.setGlobalPrefix(globalPrefix);

//   await app.listen(3100);
//   Logger.log(`Server running on http://localhost:3100/${globalPrefix}`);
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from 'utils/middlewares/redisAdapter';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const ports = [3100, 3200]; // Define multiple ports here

  for (const port of ports) {
    const app = await NestFactory.create(AppModule);
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    app.useWebSocketAdapter(redisIoAdapter);
    // app.useWebSocketAdapter(new IoAdapter(app));

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
    app.enableShutdownHooks();
    app.listen(port).then(() => {
      Logger.log(`Server running on http://localhost:${port}/${globalPrefix}`);
    });
  }
}

bootstrap();
