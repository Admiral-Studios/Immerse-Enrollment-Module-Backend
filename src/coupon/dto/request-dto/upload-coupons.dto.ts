import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { CreateTaxonomyDto } from '../../../taxonomy/dto/request-dto/create-taxonomy.dto';

export class UploadCouponsDto extends CreateTaxonomyDto {
  @Expose({ name: 'couponId' })
  @Transform(({ value }) => String(value))
  @IsString()
  wordpressId: string;

  @Expose({ name: 'Amount' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  discountType: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return null;
    const dateParts = value.split('/');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  })
  @IsDate()
  expiryDate?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : null))
  @IsNumber()
  @Min(0)
  maximalSpend?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Min(0)
  minimalSpend?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    return Array.isArray(value)
      ? value.map((cat) => String(cat.term_id || cat))
      : [];
  })
  @IsString({ each: true })
  productCategory: string[] = [];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productType?: string[] = [];

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  usageLimitPerCoupon?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : null))
  @Min(1)
  usageLimitPerUser?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.map((v) => String(v)))
  @IsString({ each: true })
  products?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => value.map((v) => String(v)))
  @IsString({ each: true })
  excludeProducts?: string[];
}
