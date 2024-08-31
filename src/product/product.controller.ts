import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequestDTO } from './dto/productCreate.request';
import { JwtAuthGuard } from '../../utils/middlewares/jwt.auth.guard';
import { ProductListingRequestDTO } from './dto/productListing.request';
import { UpdateProductRequestDTO } from './dto/productUpdate.request';

@Controller('product')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  CreateProduct(
    @Req() req: any,
    @Body() SignUpRequest: CreateProductRequestDTO,
  ) {
    return this._productService.create(req.user_details, SignUpRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get')
  GetProducts(@Req() req: any, @Query() params: ProductListingRequestDTO) {
    return this._productService.getAll(req.user_details, params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/detail/:productId')
  ProductDetail(@Req() req: any, @Param('productId') productId: string) {
    return this._productService.detail(req.user_details, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update')
  UpdateProduct(@Req() req: any, @Body() payload: UpdateProductRequestDTO) {
    return this._productService.update(req.user_details, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:productId')
  DeleteProduct(@Req() req: any, @Param('productId') productId: string) {
    return this._productService.delete(req.user_details, productId);
  }
}
