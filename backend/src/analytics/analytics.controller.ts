import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('pageviews')
  getPageviews() {
    return this.service.getPageviews();
  }

  @Get('top-products')
  getTopProducts() {
    return this.service.getTopProducts();
  }

  @Get('revenue')
  getRevenue() {
    return this.service.getRevenue();
  }
}
