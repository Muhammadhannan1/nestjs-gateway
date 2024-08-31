// import { Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     JwtModule.registerAsync({
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get<string>('JWT_SECRET'),
//       }),
//       inject: [ConfigService],
//     }),
//     ClientsModule.register([
//       {
//         name: 'AUTH',
//         transport: Transport.RMQ,
//         options: {
//           urls: ['amqp://localhost:5672'],
//           queue: 'auth-queue',
//         },

//       },
//     ]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth_exchange', // Name of the exchange
          type: 'topic', // Type of exchange
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: true },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
