import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUID } from '../../common/helper/is-valid-uuid.helper';
import { EducationalModelRepository } from '../../dal/educational-model/educational-model.repository';

@Injectable()
export class EducationalModelExistsGuard implements CanActivate {
  constructor(
    private readonly educationalModelRepository: EducationalModelRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const modelId = request.params?.modelId || request.body?.modelId;

    if (!isValidUUID(modelId)) {
      throw new NotFoundException('Educational model id must be a valid UUID');
    }

    if (!request.locals) {
      request.locals = {};
    }

    request.locals.educationalModel =
      await this.educationalModelRepository.findEducationalModelById(modelId);
    if (
      !request.locals.educationalModel ||
      request.locals.educationalModel.id !== modelId
    ) {
      throw new NotFoundException(
        'Educational model with such id does not exist',
      );
    }

    return true;
  }
}
