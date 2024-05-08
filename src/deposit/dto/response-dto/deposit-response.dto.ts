import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepositResponseDto {
  @Expose()
  defaultDepositAmount: number;

  @Expose()
  defaultDepositSelectedType: string;

  @Expose()
  defaultDepositType: string;
}
