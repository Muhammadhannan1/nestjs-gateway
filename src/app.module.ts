import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQSetupService } from 'utils/middlewares/RabbitMqSetup.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { NotificationModule } from './notification/notification.module';
import { GenericExceptionFilter } from './exception/generic-exception.fliter';
import { APP_FILTER } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),

    AuthModule,

    ProductModule,

    OrderModule,

    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RabbitMQSetupService,
    Logger,
    {
      provide: APP_FILTER,
      useClass: GenericExceptionFilter,
    },
  ],
})
export class AppModule {}
