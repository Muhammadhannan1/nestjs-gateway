import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SignUpRequestDTO } from './dto/signup.request';
import { loginRequestDTO } from './dto/login.request';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AuthService {
  constructor(
    // @Inject('AUTH') private readonly authClient: ClientProxy,
    private readonly AmqpConnection: AmqpConnection,
  ) {}

  async createUser(payload: SignUpRequestDTO) {
    // const createUser = await lastValueFrom(this.authClient.send('signUp',payload))
    const createUser = this.AmqpConnection.publish(
      'auth_exchange',
      'auth.signUp',
      payload,
    );
    console.log('payload', payload);
    return createUser;
  }

  //   async login(payload: loginRequestDTO) {
  //     return await lastValueFrom(this.authClient.send('login', payload));
  //   }

  //   async getMe(user: any) {
  //     return await lastValueFrom(this.authClient.send('getMe', user.userId));
  //   }
  //   async getHello() {
  //     this.authClient.emit('getHello', 'hello world');
  //     return { msg: 'send hello' };
  //   }
}
