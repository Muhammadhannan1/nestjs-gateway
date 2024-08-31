import { connect } from 'amqplib';

async function testPublish() {
  const connection = await connect('amqp://localhost:5672');
  const channel = await connection.createChannel();

  const payload = { name: 'test product', price: 20 };
  await channel.publish(
    'product_exchange',
    'product.create',
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );

  console.log('Test message published');

  await channel.close();
  await connection.close();
}

testPublish().catch(console.error);
