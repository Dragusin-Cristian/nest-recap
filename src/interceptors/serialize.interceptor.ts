import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ClassConstructor>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled
    // by a request handler.
    console.log('runnning before the habdler');

    return next.handle().pipe(
      map((data: any) => {
        //* data contains all fields from the db, and we want to filter some of them (password):
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // this will show only the fields marked with @Expose()
        });
      }),
    );
  }
}
