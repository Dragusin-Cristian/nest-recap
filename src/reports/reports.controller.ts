import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth-guard';
import { CurrentCat } from 'src/cats/decorators/current-cat.decorator';
import { Cat } from 'src/cats/entities/cat.entity';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto, @CurrentCat() cat: Cat) {
    return this.reportsService.create(body, cat);
  }
}
