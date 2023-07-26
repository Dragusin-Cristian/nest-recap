import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { AuthService } from './auth.service';
import { CurrentCatInterceptor } from './interceptors/current-cat.interceptor';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  controllers: [CatsController],
  providers: [
    CatsService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentCatInterceptor },
  ],
  imports: [TypeOrmModule.forFeature([Cat])],
})
export class CatsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // can have multiple middlewares hare
      //.exclude('dogs', 'elephants') // works only after apply() // it excludes the paths
      .forRoutes('cats');
    // .forRoutes({ path: 'cats', method: RequestMethod.GET }); // we can also pass Controller objects instead
  }
}
