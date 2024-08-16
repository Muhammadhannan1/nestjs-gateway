import { Injectable, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class RabbitMQSetupService implements OnModuleInit {
  async onModuleInit() {
    try {
      await execPromise('ts-node src/rabbitmq.setup.ts');
      console.log('RabbitMQ setup script executed successfully.');
    } catch (error) {
      console.error('Error executing RabbitMQ setup script:', error);
    }
  }
}
