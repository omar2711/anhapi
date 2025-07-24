import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from './redis/redis.module';
import { RedisServiceModule } from './redis/redis.service.module';
import { FuelModule } from './fuel/fuel.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    RedisServiceModule,
    FuelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
