import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportRepository: Partial<Repository<Report>>;

  beforeEach(async () => {
    // fakeReportRepository = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: 'ReportRepository',
          useValue: fakeReportRepository,
        },
      ],
      controllers: [ReportsController],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
