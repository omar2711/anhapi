import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { FuelService } from './fuel.service';

@Processor('fuel-refresh')
@Injectable()
export class FuelRefreshProcessor {
  private readonly logger = new Logger(FuelRefreshProcessor.name);

  constructor(private readonly fuelService: FuelService) {}

  @Process('refresh')
  async handleRefresh(job: Job) {
    this.logger.log('Processing fuel refresh job');
    await this.fuelService.handleRefreshJob();
    this.logger.log('Fuel refresh job completed');
  }
}
