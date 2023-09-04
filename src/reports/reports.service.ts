import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { Cat } from 'src/cats/entities/cat.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, cat: Cat) {
    const report = this.repo.create(reportDto);
    report.cat = cat;
    return this.repo.save(report);
  }
}
