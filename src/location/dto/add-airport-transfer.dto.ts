import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddAirportTransferDto {
  @IsString()
  @Transform(({ value }) => String(value))
  location: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  price: number;
}
