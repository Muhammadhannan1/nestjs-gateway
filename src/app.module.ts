import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQSetupService } from 'utils/middlewares/RabbitMqSetup.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQSetupService],
})
export class AppModule {}
