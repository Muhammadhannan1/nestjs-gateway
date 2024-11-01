import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient;
  private subClient;
  async connectToRedis(): Promise<void> {
    this.pubClient = createClient({ url: `redis://localhost:6379` });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
  // Method to publish a message to a Redis channel
  //   async publishToChannel(channel: string, message: string): Promise<void> {
  //     await this.pubClient.publish(channel, message);
  //   }
  //   onMessage(callback: (channel: string, message: string) => void) {
  //     this.subClient.on('message', callback);
  //   }
}
