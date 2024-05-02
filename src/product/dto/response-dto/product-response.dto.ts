import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { BaseEntityResponseDto } from '../../../common/dto/base-entity-response.dto';
import { EducationalModelResponseDto } from '../../../educational-model/dto/response-dto/educational-model-response.dto';
import { SubjectResponseDto } from '../../../subject/dto/response-dto/subject-response.dto';
import { LocationResponseDto } from '../../../location/dto/response-dto/location-response.dto';
import { parseStartEndDates } from '../../../program-date/helper/parse-start-end-dates.helper';

@Exclude()
export class ClassificationResponseDto extends BaseEntityResponseDto {}

@Exclude()
export class ProductProgrammeDatesResponseDto extends BaseEntityResponseDto {
  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;
}

@Exclude()
export class ProductPackageResponseDto {
  @Expose()
  id: string;

  @Expose()
  packageTitle: string;

  @Expose()
  isAvailableForBundle: boolean;

  @Expose()
  @Type(() => ClassificationResponseDto)
  classification: ClassificationResponseDto;

  @Expose()
  description: string;

  @Expose()
  featuresTitle: string;

  @Expose()
  listOfFeatures: string;

  @Expose()
  listOfAdditionalFeatures: string;

  @Expose({ name: 'originalPrice' })
  @Transform(({ obj }) => obj.originalPrice || obj.price)
  price: number;

  @Expose({ name: 'sale' })
  discount: number;

  @Expose({ name: 'price' })
  @Transform(({ obj }) => (obj.originalPrice ? obj.price : null))
  discountPrice: number;

  @Expose()
  isDepositEnabled: boolean;

  @Expose()
  @Type(() => ProductProgrammeDatesResponseDto)
  programDates: ProductProgrammeDatesResponseDto[];

  @Expose()
  @Transform(({ value }) => (value ? parseStartEndDates(value) : null))
  dateRange: ProductProgrammeDatesResponseDto;

  @Expose()
  depositType: number;

  @Expose()
  depositAmount: number;
}

@Exclude()
export class ProductAgeResponseDto extends BaseEntityResponseDto {
  @Expose()
  minAge: number;

  @Expose()
  maxAge: number;
}

@Exclude()
export class ProductPathwayResponseDto extends BaseEntityResponseDto {}

@Exclude()
export class ProductClassificationResponseDto extends BaseEntityResponseDto {}

@Exclude()
export class ProductTagResponseDto extends BaseEntityResponseDto {}

@Exclude()
export class ProductTeachingFormat extends BaseEntityResponseDto {}

@Exclude()
export class ProductTaxonomyResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => LocationResponseDto)
  location: LocationResponseDto;

  @Expose()
  @Type(() => ProductClassificationResponseDto)
  classifications: ProductClassificationResponseDto[];

  @Expose()
  pathway: string;

  @Expose()
  @Type(() => EducationalModelResponseDto)
  educationalModel: EducationalModelResponseDto;

  @Expose()
  @Type(() => SubjectResponseDto)
  subject: SubjectResponseDto;

  @Expose()
  @Type(() => ProductProgrammeDatesResponseDto)
  programDates: ProductProgrammeDatesResponseDto[];

  @Expose()
  @Type(() => ProductTeachingFormat)
  teachingFormat: ProductTeachingFormat;

  @Expose()
  @Type(() => ProductTagResponseDto)
  tags: ProductTagResponseDto[];

  @Expose()
  @Type(() => ProductAgeResponseDto)
  age: ProductAgeResponseDto;
}

@Exclude()
export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  dateDuration: string;

  @Expose()
  priceStartsAt: number;

  @Expose()
  packageSummary: string[];

  @Expose()
  productId: string;

  @Expose()
  preTitle: string;

  @Expose()
  featuredImage: string;

  @Expose()
  @Type(() => ProductPackageResponseDto)
  packages: ProductPackageResponseDto[];

  @Expose()
  @Type(() => ProductTaxonomyResponseDto)
  taxonomy: ProductTaxonomyResponseDto;
}
