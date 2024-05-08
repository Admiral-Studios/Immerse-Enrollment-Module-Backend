import { Exclude, Expose, Type } from 'class-transformer';
import { OrderProductOrder } from './order-product-order.dto';
import { OrderStudentDetails } from './order-student-details.dto';

@Exclude()
export class UnfinishedOrderResponseDto {
  @Expose()
  totalOrderAmount: number;

  @Expose()
  totalDepositAmount: number;

  @Expose()
  receiveUpdates: boolean;

  @Expose()
  @Type(() => OrderStudentDetails)
  studentDetails: OrderStudentDetails;

  @Expose()
  @Type(() => OrderProductOrder)
  productOrder: OrderProductOrder;
}
