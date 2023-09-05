import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CatsService } from '../cats.service';
import { Cat } from '../entities/cat.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentCat?: Cat;
    }
  }
}

@Injectable()
export class CurrentCatMiddleware implements NestMiddleware {
  constructor(private catsService: CatsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { catId } = req.session || {};

    if (catId) {
      const cat = await this.catsService.findOne(catId);
      req.currentCat = cat;
    }

    next();
  }
}
