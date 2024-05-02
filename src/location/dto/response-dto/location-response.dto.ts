import { Exclude, Expose } from 'class-transformer';
import { BaseEntityResponseDto } from '../../../common/dto/base-entity-response.dto';

@Exclude()
export class LocationResponseDto extends BaseEntityResponseDto {
  @Expose()
  airportTransferPrice: number;

  @Expose()
  color: string;
}
