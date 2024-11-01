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

    const createUser = await this.AmqpConnection.request({
      exchange: 'auth_exchange',
      routingKey: 'auth.signUp',
      payload,
      // timeout: 5000, // Timeout for waiting for a response
    });
    return createUser;
    // return {status:true,message:'User Created Successfully',createUser}; // Return the response back to the client
  }

  async login(payload: loginRequestDTO) {
    try {
      const loginUser = await this.AmqpConnection.request({
        exchange: 'auth_exchange',
        routingKey: 'auth.login',
        payload,
        // timeout: 5000, // Timeout for waiting for a response
      });
      return loginUser;
      // return {status:true,message:'User Created Successfully',createUser}; // Return the response back to the client
    } catch (error) {
      throw new Error('Failed to login user');
    }
  }

  // async getUserDetails(){}
}
