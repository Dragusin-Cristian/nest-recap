import { Controller, Get } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get()
  getHello() {
    return 'Hello';
  }
}
