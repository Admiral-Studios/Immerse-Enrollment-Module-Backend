import { Transform } from 'class-transformer';

export function FormatDate(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) return value;
    return new Date(value).toLocaleDateString('en-US', {
      timeZone: 'UTC',
    });
  });
}
