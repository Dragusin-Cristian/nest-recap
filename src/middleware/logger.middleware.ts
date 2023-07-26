import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.method + ' request' + ' for path ' + req.url);
    next(); // goes to the next middleware or ends the req res cycle if no middleware is following
    // res.status(200).json({ message: "Hello from middleware!" }) // ends the req res cycle
  }
}
