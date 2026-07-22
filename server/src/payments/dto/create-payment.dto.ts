import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  productName!: string;

  @IsPositive()
  price!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
