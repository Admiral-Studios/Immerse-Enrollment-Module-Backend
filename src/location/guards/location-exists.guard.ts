import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidUUID } from '../../common/helper/is-valid-uuid.helper';
import { LocationRepository } from '../../dal/location/location.repository';

@Injectable()
export class LocationExistsGuard implements CanActivate {
  constructor(private readonly locationRepository: LocationRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const locationId = request.params?.locationId || request.body?.locationId;

    if (!isValidUUID(locationId)) {
      throw new NotFoundException('Location id must be a valid UUID');
    }

    if (!request.locals) {
      request.locals = {};
    }

    request.locals.location = await this.locationRepository.findLocationById(
      locationId,
    );
    if (!request.locals.location || request.locals.location.id !== locationId) {
      throw new NotFoundException('Location with such id does not exist');
    }

    return true;
  }
}
