import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SubjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;
}
