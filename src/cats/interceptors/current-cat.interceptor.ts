import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { CatsService } from '../cats.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentCatInterceptor implements NestInterceptor {
  constructor(private readonly catsService: CatsService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const catSession = request.session || {};

    if (catSession) {
      const cat = await this.catsService.findOne(catSession.catId);
      request.currentCat = cat;
    }

    return next.handle();
  }
}
