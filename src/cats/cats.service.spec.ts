import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { Repository } from 'typeorm';
import { Cat } from './entities/cat.entity';

describe('CatsService', () => {
  let service: CatsService;
  let fakeRepo: Partial<Repository<Cat>>;

  beforeEach(async () => {
    fakeRepo = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: 'CatRepository',
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
