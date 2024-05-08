import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import {
  InnerRequest,
  LocalsInnerRequest,
} from '../interfaces/inner-request.interface';

const factory = (
  property: keyof LocalsInnerRequest | undefined,
  ctx: ExecutionContext,
): LocalsInnerRequest | LocalsInnerRequest[keyof LocalsInnerRequest] => {
  const request: InnerRequest = ctx?.switchToHttp().getRequest();
  const locals = request.locals as LocalsInnerRequest;

  return property ? locals?.[property] : locals;
};

export const Locals = createParamDecorator(factory);
