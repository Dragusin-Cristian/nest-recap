import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//* Can't reach the DI container from here for the CatsService.
//* This is why we have to use an interceptor.
export const CurrentCat = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentCat;
  },
);
