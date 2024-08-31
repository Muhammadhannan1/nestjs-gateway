import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateProductRequestDTO } from './dto/productCreate.request';
import { ProductListingRequestDTO } from './dto/productListing.request';
import { ObjectId } from 'bson';
import { UpdateProductRequestDTO } from './dto/productUpdate.request';

@Injectable()
export class ProductService {
  constructor(private readonly AmqpConnection: AmqpConnection) {}

  async create(user: any, payload: CreateProductRequestDTO) {
    await this.AmqpConnection.publish('product_exchange', 'product.create', {
      user,
      payload,
    });
    return { stauts: true, message: 'You will be notified shortly' };
  }

  async getAll(user: any, params: ProductListingRequestDTO) {
    const products = await this.AmqpConnection.request({
      exchange: 'product_exchange',
      routingKey: 'product.get',
      payload: { apiType: 'getAll', params },
      // timeout: 5000, // Timeout for waiting for a response
    });
    return products;
  }
  async detail(user_details: any, productId: string) {
    if (!ObjectId.isValid(productId)) {
      // Return an error response or throw an exception
      return { status: false, message: 'Invalid product id', data: null };
    }
    const products = await this.AmqpConnection.request({
      exchange: 'product_exchange',
      routingKey: 'product.get',
      payload: { apiType: 'detail', productId: new Object(productId) },
      // timeout: 5000, // Timeout for waiting for a response
    });
    return products;
  }
  async update(user: any, payload: UpdateProductRequestDTO) {
    await this.AmqpConnection.publish('product_exchange', 'product.update', {
      user,
      payload,
    });
    return { stauts: true, message: 'You will be notified shortly' };
  }
  async delete(user: any, productId: string) {
    await this.AmqpConnection.publish('product_exchange', 'product.delete', {
      user,
      payload: { productId: new ObjectId(productId) },
    });
    return { stauts: true, message: 'You will be notified shortly' };
  }
}
