import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUID } from '../../common/helper/is-valid-uuid.helper';
import { SubjectRepository } from '../../dal/subject/subject.repository';

@Injectable()
export class SubjectExistsGuard implements CanActivate {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const subjectId = request.params?.subjectId || request.body?.subjectId;

    if (!isValidUUID(subjectId)) {
      throw new NotFoundException('Subject id must be a valid UUID');
    }

    if (!request.locals) {
      request.locals = {};
    }

    request.locals.subject = await this.subjectRepository.findSubjectById(
      subjectId,
    );

    if (!request.locals.subject || request.locals.subject.id !== subjectId) {
      throw new NotFoundException('Subject with such id does not exist');
    }

    return true;
  }
}
