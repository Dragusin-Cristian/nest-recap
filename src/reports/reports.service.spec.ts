import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let fakeRepo: Partial<Repository<Report>>;

  beforeEach(async () => {
    fakeRepo = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: 'ReportRepository',
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
