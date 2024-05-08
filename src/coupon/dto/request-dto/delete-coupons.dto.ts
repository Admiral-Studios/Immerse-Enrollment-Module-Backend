import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteCouponsDto {
  @Transform(({ value }) => value.map((elem) => String(elem)))
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  existingCouponsIds: string[];
}
