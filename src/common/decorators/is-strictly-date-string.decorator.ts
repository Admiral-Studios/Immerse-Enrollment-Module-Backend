import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { Transform, TransformFnParams } from 'class-transformer';
import { ValidationOptions } from 'class-validator';

const errorMessage = 'Date must be in YYYY-MM-DD format and valid';

export function IsStrictlyDateString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    Transform(
      ({ value }: TransformFnParams) => {
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          throw new BadRequestException(errorMessage);
        }

        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        ) {
          return new Date(value);
        }
        throw new BadRequestException(errorMessage);
      },
      { toClassOnly: true },
    )(object, propertyName);
  };
}
