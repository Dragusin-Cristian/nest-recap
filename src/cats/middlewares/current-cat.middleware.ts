import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CatsService } from '../cats.service';

@Injectable()
export class CurrentCatMiddleware implements NestMiddleware {
  constructor(private catsService: CatsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { catId } = req.session || {};

    if (catId) {
      const cat = await this.catsService.findOne(catId);
      // @ts-ignore
      req.currentCat = cat;
    }

    next();
  }
}
