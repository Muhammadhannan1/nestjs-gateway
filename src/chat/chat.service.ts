import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ClientKafka } from '@nestjs/microservices';
import { SendMessageDTO } from './dto/sendMessage.dto';
import { Producer, Message } from 'kafkajs'; // Ensure you have kafkajs installed

@Injectable()
export class ChatService implements OnModuleInit, OnModuleDestroy {
  private kafkaProducer: Producer;
  private messageBuffer: Message[] = [];
  private batchSize = 3; // Adjust batch size as needed
  private batchInterval = 5000; // Interval to send batch (in milliseconds)
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientKafka,
  ) {
    this.startBatchInterval();
  }
  async onModuleDestroy() {
    await this.flushMessages();
  }

  async onModuleInit() {
    const requestPatterns = ['chat.getMessages'];
    requestPatterns.forEach((pattern) => {
      this.chatClient.subscribeToResponseOf(pattern);
    });
    await this.chatClient.connect();
    this.kafkaProducer = this.chatClient['producer']; // Access the internal producer directly
  }

  async sendMessage(userId, payload: SendMessageDTO) {
    // Add the message to the buffer
    this.messageBuffer.push({
      value: JSON.stringify({
        userId,
        message: payload.message,
        createdAt: new Date().toISOString(),
      }),
    });
    console.log('Current messageBuffer length:', this.messageBuffer.length);
    console.log('Current messageBuffer contents:', this.messageBuffer);

    // this.kafkaProducer.send({
    //   topic: 'chat.createMessages',
    //   messages: [
    //     {
    //       value: JSON.stringify({ userId, message: payload.message }),
    //       // partition: 2,
    //     },
    //   ],
    // });
    // If the buffer reaches the batch size, send it
    if (this.messageBuffer.length >= this.batchSize) {
      await this.flushMessages();
    }
  }

  private async flushMessages() {
    if (this.messageBuffer.length > 0) {
      await this.kafkaProducer.send({
        topic: 'chat.createMessages',
        messages: this.messageBuffer,
      });
      // Clear the buffer after sending
      this.messageBuffer = [];
    }
  }

  async getMessages(userId) {
    const data = await new Promise<any>((resolve) =>
      this.chatClient.send('chat.getMessages', { userId }).subscribe((data) => {
        resolve(data);
      }),
    );
    return data;
  }

  private startBatchInterval() {
    setInterval(() => this.flushMessages(), this.batchInterval);
  }
}
