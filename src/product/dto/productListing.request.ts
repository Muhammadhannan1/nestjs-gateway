import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class ProductListingRequestDTO {
  @IsNotEmpty({ message: 'page is required' })
  @IsString()
  page: string;

  @IsNotEmpty({ message: 'pageSize is required' })
  @IsString()
  pageSize: string;
}
