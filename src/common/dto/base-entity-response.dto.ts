import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseEntityResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;
}
