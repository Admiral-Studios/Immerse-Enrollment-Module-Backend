import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteProductsDto {
  @Transform(({ value }) => value.map((elem) => String(elem)))
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  existingProductIds: string[];
}
