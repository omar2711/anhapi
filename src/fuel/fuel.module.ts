import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { FuelRefreshProcessor } from './fuel-refresh.processor';
import { RedisServiceModule } from '../redis/redis.service.module';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'fuel-refresh',
    }),
    RedisServiceModule,
  ],
  providers: [FuelService, FuelRefreshProcessor],
  controllers: [FuelController],
})
export class FuelModule {}
