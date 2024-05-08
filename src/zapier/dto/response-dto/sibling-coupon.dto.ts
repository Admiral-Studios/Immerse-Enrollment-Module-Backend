import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { OrderStudentDetails } from './order-student-details.dto';

@Exclude()
export class SiblingCouponResponseDto {
  @Expose()
  title: string;

  @Expose()
  amount: string;

  @Expose()
  discountType: string;

  @Expose()
  @Transform(({ value }) => value && new Date(value).toLocaleDateString())
  expiryDate: Date;

  @Expose()
  @Transform(({ value }) =>
    plainToInstance(OrderStudentDetails, JSON.parse(value)),
  )
  studentDetails: OrderStudentDetails;
}
