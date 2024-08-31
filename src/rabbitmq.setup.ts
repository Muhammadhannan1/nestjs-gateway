// setup-rabbitmq.ts
import { connect } from 'amqplib';

async function setupRabbitMQ() {
  const connection = await connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  try {
    const exchanges = [
      { name: 'auth_exchange', type: 'topic' },
      { name: 'product_exchange', type: 'topic' },
      { name: 'product_dlx_exchange', type: 'direct' },
    ];
    const queues = [
      { name: 'auth_signUp_queue', ttl: 10000, maxLength: 10 },
      { name: 'auth_login_queue', ttl: 10000, maxLength: 10 },
      {
        name: 'product_create_queue',
        dlx: 'product_dlx_exchange',
        dlxRoutingKey: 'product.dead-letter',
        ttl: 10000, // 10 seconds TTL for testing
        maxLength: 3, // Max length of 3 messages for testing
      },
      {
        name: 'product_update_queue',
        dlx: 'product_dlx_exchange',
        dlxRoutingKey: 'product.dead-letter',
        ttl: 10000, // 10 seconds TTL for testing
        maxLength: 3, // Max length of 3 messages for testing
      },
      {
        name: 'product_delete_queue',
        dlx: 'product_dlx_exchange',
        dlxRoutingKey: 'product.dead-letter',
        ttl: 10000, // 10 seconds TTL for testing
        maxLength: 3, // Max length of 3 messages for testing
      },
      {
        name: 'product_get_queue',
        dlx: 'product_dlx_exchange',
        dlxRoutingKey: 'product.dead-letter',
        ttl: 10000, // 10 seconds TTL for testing
        maxLength: 3, // Max length of 3 messages for testing
      },
      {
        name: 'product_dlx_queue', // Single DLQ for all product queues
        ttl: 60000, // 1 minute TTL for DLQ (adjust as needed)
        maxLength: 1000, // Max length for DLQ (adjust as needed)
      },
    ];

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
      {
        exchange: 'product_exchange',
        queue: 'product_create_queue',
        routingKey: 'product.create',
      },
      {
        exchange: 'product_exchange',
        queue: 'product_update_queue',
        routingKey: 'product.update',
      },
      {
        exchange: 'product_exchange',
        queue: 'product_delete_queue',
        routingKey: 'product.delete',
      },
      {
        exchange: 'product_exchange',
        queue: 'product_get_queue',
        routingKey: 'product.get',
      },
      {
        exchange: 'product_dlx_exchange',
        queue: 'product_dlx_queue',
        routingKey: 'product.dead-letter',
      },
    ];

    // Create exchanges
    for (const exchange of exchanges) {
      await channel.assertExchange(exchange.name, exchange.type, {
        durable: true,
      });
      console.log(`Exchange ${exchange.name} created or verified.`);
    }

    // Create queues
    for (const queue of queues) {
      try {
        const options: any = {
          durable: true,
          arguments: {
            ...(queue.dlx
              ? {
                  'x-dead-letter-exchange': queue.dlx,
                  'x-dead-letter-routing-key': queue.dlxRoutingKey,
                }
              : {}),
            ...(queue.ttl ? { 'x-message-ttl': queue.ttl } : {}),
            ...(queue.maxLength ? { 'x-max-length': queue.maxLength } : {}),
          },
        };
        await channel.assertQueue(queue.name, options);
        console.log(`Queue ${queue.name} created or verified.`);
      } catch (error) {
        console.error(`Failed to create queue ${queue.name}:`, error);
      }
    }

    // Bind queues to exchanges
    for (const binding of bindings) {
      try {
        await channel.bindQueue(
          binding.queue,
          binding.exchange,
          binding.routingKey,
        );
        console.log(
          `Queue ${binding.queue} bound to exchange ${binding.exchange} with routing key ${binding.routingKey}.`,
        );
      } catch (error) {
        console.error(
          `Failed to bind queue ${binding.queue} to exchange ${binding.exchange}:`,
          error,
        );
      }
    }
    console.log('RabbitMQ setup complete');
  } catch (error) {
    console.error(
      'Error executing RabbitMQ setup script in main file:',
      error.message,
    );
  } finally {
    if (channel) {
      try {
        await channel.close();
      } catch (err) {
        console.error('Error closing channel:', err);
      }
    }
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
  // await channel.close();
  // await connection.close();
}

setupRabbitMQ().catch(console.error);
