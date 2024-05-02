import { IsString } from 'class-validator';
import { CreateTaxonomyDto } from '../../../taxonomy/dto/request-dto/create-taxonomy.dto';

export class CreateEducationalModelDto extends CreateTaxonomyDto {
  @IsString()
  description: string;
}
