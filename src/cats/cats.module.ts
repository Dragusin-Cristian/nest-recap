import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { AuthService } from './auth.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService, AuthService],
  imports: [TypeOrmModule.forFeature([Cat])],
})
export class CatsModule {}
