import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class AddConsecutiveCourseDto {
  @ApiProperty({
    description: 'ID of consecutive product to add in uuid format',
    example: '8dff532d-c0f4-4199-aa69-3cc4a50c8cd7',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enSuiteAdded: boolean;
}
