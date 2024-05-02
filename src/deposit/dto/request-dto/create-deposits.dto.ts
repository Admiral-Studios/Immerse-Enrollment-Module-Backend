import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDepositDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  defaultDepositAmount: number;

  @IsString()
  defaultDepositSelectedType: string;

  @IsString()
  defaultDepositType: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.map((v) => String(v.classification)))
  @IsString({ each: true })
  depositClassifications: string[] = [];
}
