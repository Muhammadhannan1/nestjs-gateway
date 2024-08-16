// setup-rabbitmq.ts
import { connect } from 'amqplib';

async function setupRabbitMQ() {
  const connection = await connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const exchanges = ['auth_exchange'];
  const queues = ['auth_signUp_queue', 'auth_login_queue'];
  const bindings = [
    {
      exchange: 'auth_exchange',
      queue: 'auth_signUp_queue',
      routingKey: 'auth.signUp',
    },
    {
      exchange: 'auth_exchange',
      queue: 'auth_login_queue',
      routingKey: 'auth.login',
    },
  ];

  // Create exchanges
  for (const exchange of exchanges) {
    await channel.assertExchange(exchange, 'topic', { durable: true });
  }

  // Create queues
  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });
  }

  // Bind queues to exchanges
  for (const binding of bindings) {
    await channel.bindQueue(
      binding.queue,
      binding.exchange,
      binding.routingKey,
    );
  }

  console.log('RabbitMQ setup complete');

  await channel.close();
  await connection.close();
}

setupRabbitMQ().catch(console.error);
