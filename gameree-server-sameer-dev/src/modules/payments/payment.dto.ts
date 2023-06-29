import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  hash: string;

  @IsNotEmpty()
  amount: string;

  from: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  chargedBy: string;

  collectibleId: string;

  to: string;
  boughtBy: string;
  soldBy: string;
}
export class CreateChargeDto {
  @IsNotEmpty()
  total: number;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  itemName: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  payment_id: string;

  @IsNotEmpty()
  collectibleId: string;

  @IsNotEmpty()
  email: string;

  count: number;
  paymentId: string;
  nftPrice: number;
  discount: any;
  coupon: any;
}
export class BuyCollectibleDto {
  @IsNotEmpty()
  hash: string;

  @IsNotEmpty()
  amount: string;

  from: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  chargedBy: string;

  @IsNotEmpty()
  collectibleId: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  boughtBy: string;

  @IsNotEmpty()
  soldBy: string;
}
export class GoogleApplePayDto {
  @IsNotEmpty()
  chargedBy: string;

  @IsNotEmpty()
  transactionId: string;

  @IsNotEmpty()
  collectibleId: string;

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  paymentStatus: string;

}