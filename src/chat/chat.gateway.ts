import { Inject, Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'utils/middlewares/jwt.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { RedisIoAdapter } from 'utils/middlewares/redisAdapter';
import { plainToInstance } from 'class-transformer';
import { SendMessageDTO } from './dto/sendMessage.dto';
import { validate } from 'class-validator';

interface CustomSocket extends Socket {
  user_details: {
    email: string;
    userType: string;
    userId: number;
  };
}

@WebSocketGateway()
export class ChatGateway
  implements
    OnGatewayInit<Server>,
    OnGatewayConnection<Socket>,
    OnGatewayDisconnect<Socket>
{
  constructor(
    @Inject(ChatService) private readonly chatService: ChatService, // @Inject(MediaService) private mediaService: MediaService,
    private readonly jwtService: JwtService,
    private redisIoAdapter: RedisIoAdapter,
  ) {}

  private logger = new Logger('ChatGateway');
  private userSocketMap = new Map();
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('socket init');
    // this.redisIoAdapter.onMessage(async (channel, message) => {
    //   if (channel === 'MESSAGES') {
    //     this.server.emit('message', message);
    //   }
    // });
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(socket: CustomSocket) {
    // const user = socket.user_details; // Access user details from the guard
    const token: any = socket.handshake.query.token;
    const user = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    console.log('user', user);
    if (!user) {
      socket.disconnect();
      return;
    }
    socket.user_details = user;
    this.userSocketMap.set(user.userId.toString(), socket.id);
    // await this.chatService.setUserOnlineStatus(user.userId, true);
    this.logger.log(
      `Client ${socket.id} connected, user ==> ${JSON.stringify(socket.user_details)}`,
    );
    // const roomIds = await this.chatService.getUserRoomIds(socket.user_details.userId);
    // this.server.to(roomIds).emit('user_connected_status', { data: { connected: true } });
  }

  async handleDisconnect(socket: CustomSocket) {
    if (socket.user_details) {
      this.userSocketMap.delete(socket.user_details.userId.toString());
      // await this.chatService.setUserOnlineStatus(socket.user_details.userId, false);
      // const roomIds = await this.chatService.getUserRoomIds(socket.user_details.userId);
      // this.server.to(roomIds).emit('user_connected_status', { data: { connected: false } });
    }
    this.logger.log(`Client ${socket.id} disconnected`);
  }

  @SubscribeMessage('getMessage')
  async getMessages(socket: CustomSocket) {
    const response = await this.chatService.getMessages(
      socket.user_details.userId,
    );
    return { data: response };
  }

  @SubscribeMessage('send_message')
  async handleMessage(socket: CustomSocket, data: { message?: string }) {
    const payload = plainToInstance(SendMessageDTO, data);
    const validateErrors = await validate(payload);

    if (validateErrors.length > 0) {
      const errorMessages = this.extractValidationErrors(validateErrors);
      return { message: errorMessages };
    }
    this.server.emit('new_message', data.message);
    await this.chatService.sendMessage(socket.user_details.userId, payload);
    // await this.redisIoAdapter.publishToChannel('MESSAGES', data.message);
    // return 'Hello world!';
  }

  private extractValidationErrors(errors: any): string[] {
    const messages: string[] = [];
    errors.forEach((error: any) => {
      if (error.constraints) {
        const constraints = Object.values(error.constraints).join(', ');
        // const invalidValue = JSON.stringify(error.value);
        messages.push(
          `${constraints}`,
          // `${error.property}: ${constraints}. Invalid value: ${invalidValue}`,
        );
      }
      if (error.children && error.children.length) {
        messages.push(...this.extractValidationErrors(error.children));
      }
    });
    return messages;
  }
}
