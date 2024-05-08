import { Transform } from 'class-transformer';
import * as he from 'he';

export function FormatSpecialCharacters(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return he.decode(value);
  });
}
