// import { Kafka } from 'kafkajs';

// async function createKafkaTopic() {
//   const kafka = new Kafka({
//     clientId: 'nestjs-app',
//     brokers: ['localhost:9093'],
//   });

//   const admin = kafka.admin();
//   await admin.connect();

//   // Create a topic
//   console.log('inside createKafkaTopic');
//   const abc = await admin.createTopics({
//     topics: [
//       {
//         topic: 'nestjs_topic',
//         numPartitions: 3, // specify number of partitions
//       },
//     ],
//     waitForLeaders: true,
//   });
//   console.log('abc', abc);
//   console.log('Kafka Topic Created!');
//   await admin.disconnect();
// }

// createKafkaTopic().catch(console.error);
