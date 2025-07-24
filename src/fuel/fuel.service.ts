import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import axios from 'axios';

const DEPARTAMENTOS = [1,2,3,4,5,6,7,8,9];
const TIPOS = [0,1,2,3];

const DEPARTAMENTOS_MAP = {
  'chuquisaca': 1,
  'la paz': 2,
  'cochabamba': 3,
  'oruro': 4,
  'potosi': 5,
  'tarija': 6,
  'santa cruz': 7,
  'beni': 8,
  'pando': 9,
};

const TIPOS_MAP = {
  'gasolina': 0,
  'gasolina premium': 1,
  'diesel': 2,
  'diesel uls': 3,
};

@Injectable()
export class FuelService {
  private readonly logger = new Logger(FuelService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @InjectQueue('fuel-refresh') private readonly fuelQueue: Queue,
  ) {
    this.baseUrl = this.configService.get('FUELBOL_API_BASE');
    this.scheduleRefresh();
  }

  async scheduleRefresh() {
    const interval = this.configService.get<number>('REFRESH_INTERVAL_MINUTES', 11) * 60 * 1000;
    await this.fuelQueue.add('refresh', {}, { repeat: { every: interval } });
  }

  async handleRefreshJob() {
    for (const departamento of DEPARTAMENTOS) {
      for (const tipo of TIPOS) {
        await this.fetchAndStore(departamento, tipo);
      }
    }
  }

  async fetchAndStore(departamento: number, tipo: number) {
    const url = `${this.baseUrl}/${departamento}/${tipo}`;
    try {
      const { data } = await axios.get(url);
      const key = `fuel:${departamento}:${tipo}`;
      await this.redisService.set(key, data, 720);
    } catch (err) {
      this.logger.error(`Error fetching ${url}: ${err}`);
    }
  }

  async getAllFromRedis() {
    const keys = await this.redisService.keys('fuel:*');
    const results = {};
    for (const key of keys) {
      results[key] = await this.redisService.get(key);
    }
    return results;
  }

  async getFromRedis(departamento: string, tipo: string) {
    const key = `fuel:${departamento}:${tipo}`;
    return this.redisService.get(key);
  }

  async searchStations(query: { id?: number; name?: string; direction?: string }) {
    const keys = await this.redisService.keys('fuel:*');
    const results = [];

    for (const key of keys) {
      const data = await this.redisService.get(key);
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (!parsed?.features) continue;

      for (const feature of parsed.features) {
        const props = feature.properties;
        if (
          (query.id && props.idFuelStation === query.id) ||
          (query.name && props.fuelStationName?.toLowerCase().includes(query.name.toLowerCase())) ||
          (query.direction && props.direction?.toLowerCase().includes(query.direction.toLowerCase()))
        ) {
          results.push(feature);
        }
      }
    }
    return results;
  }
}
