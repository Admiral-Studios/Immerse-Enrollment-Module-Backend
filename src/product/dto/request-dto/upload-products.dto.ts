import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

class TaxonomyDto {
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v) => String(v)))
  classification: string[];

  @IsString()
  @Expose({ name: 'educational-model' })
  @Transform(({ value }) => String(value[0]))
  educationalModel: string;

  @IsString()
  @Expose({ name: 'locations' })
  @Transform(({ value }) => String(value[0]))
  location: string;

  @IsString()
  @Transform(({ value }) => String(value[0]))
  age: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value.length ? String(value[0]) : null))
  pathway?: string;

  @IsString()
  @Transform(({ value }) => String(value[0]))
  subject: string;

  @IsArray()
  @Transform(({ value }) => value.map((v) => String(v)))
  tags: string[];

  @IsString()
  @IsOptional()
  @Expose({ name: 'teaching-format' })
  @Transform(({ value }) => String(value[0]))
  teachingFormat: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v) => String(v)))
  @Expose({ name: 'programme-date' })
  programDates: string[];
}

class PackageDto {
  @IsBoolean()
  isSoldOut: boolean;

  @IsBoolean()
  additionalFeaturesAvailable: boolean;

  @IsBoolean()
  addsOnAvailable: boolean;

  @IsOptional()
  @IsString()
  addsOnText?: string;

  @IsString()
  @Transform(({ value }) => {
    if (value) return String(value);
  })
  classification: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value) : null))
  bundleClassification: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value) : null))
  bundleEducationalModel: string;

  @IsOptional()
  @IsString()
  depositType?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : null))
  dateRange?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  featuresTitle: string;

  @IsOptional()
  @IsBoolean()
  isAvailableInPackage?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Expose({ name: 'IsAvailable' })
  isAvailable?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isAvailableForBundle?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isDepositEnabled?: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((elem) => elem['additional_list']) : [],
  )
  listOfAdditionalFeatures: string[];

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((elem) => elem['item']))
  listOfFeatures: string[];

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  originalPrice?: number;

  @IsBoolean()
  recommendation: boolean;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  sale?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value) || null)
  depositAmount?: number;

  @IsString()
  packageTitle: string;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.map((v) => String(v)))
  @Expose({ name: 'availableDates' })
  programDates: string[];
}

export class UploadProductsDto {
  @IsString()
  @IsOptional()
  preTitle?: string;

  @IsString()
  @Transform(({ value }) => String(value))
  productId: string;

  @IsBoolean()
  isFullyBooked: boolean;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isVisible: boolean;

  @ValidateNested({ each: true })
  @Type(() => TaxonomyDto)
  taxonomy: TaxonomyDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsString()
  @IsOptional()
  @Expose({ name: 'featureImage' })
  featuredImage?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  dateDuration?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  priceStartsAt?: number;

  @IsString({ each: true })
  @IsArray()
  @Transform(({ value }) => value.map((elem) => elem['item']))
  productSummary: string[];
}
