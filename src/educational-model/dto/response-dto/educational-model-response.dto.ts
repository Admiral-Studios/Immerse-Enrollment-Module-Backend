import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EducationalModelResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  minAge: number;

  @Expose()
  maxAge: number;
}
