import { Injectable, OnModuleInit } from '@nestjs/common';
// import { exec } from 'child_process';
// import { promisify } from 'util';
import { Kafka } from 'kafkajs';

// const execPromise = promisify(exec);

@Injectable()
export class KafkaSetupService implements OnModuleInit {
  async onModuleInit() {
    try {
      console.log('inside KafkaSetupService');
      const kafka = new Kafka({
        clientId: 'nestjs-app',
        brokers: ['localhost:9093'],
      });

      const admin = kafka.admin();
      await admin.connect();
      const topics: { topic: string; numPartitions: number }[] = [
        { topic: 'chat.createMessages', numPartitions: 3 },
      ];
      const existingTopics = await admin.listTopics();
      const topicsToCreate = topics.filter(
        (topic) => !existingTopics.includes(topic.topic),
      );
      // admin.describeGroups()
      // Create a topic
      console.log('inside createKafkaTopic', existingTopics);
      if (topicsToCreate.length) {
        const abc = await admin.createTopics({
          topics: topicsToCreate,
        });
        console.log('Kafka Topic Created!', abc);
      }
      await admin.describeGroups(['chat-consumer']);
      console.log('Kafka Topic already Created!');
      await admin.disconnect();
      //   await execPromise('ts-node src/kafka.setup.ts');
      console.log('Kafka setup script executed successfully.');
    } catch (error) {
      console.error(
        'Error executing Kafka setup script:',
        error.message || error,
      );
    }
  }
}
