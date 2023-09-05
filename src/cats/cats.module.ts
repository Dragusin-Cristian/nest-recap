import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { AuthService } from './auth.service';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { CurrentCatMiddleware } from './middlewares/current-cat.middleware';

@Module({
  controllers: [CatsController],
  providers: [CatsService, AuthService],
  imports: [TypeOrmModule.forFeature([Cat])],
})
export class CatsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // can have multiple middlewares hare
      //.exclude('dogs', 'elephants') // works only after apply() // it excludes the paths
      .forRoutes('cats');
    // .forRoutes({ path: 'cats', method: RequestMethod.GET }); // we can also pass Controller objects instead

    consumer.apply(CurrentCatMiddleware).forRoutes('*');
  }
}
