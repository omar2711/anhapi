import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async set(key: string, value: any, expireSeconds?: number) {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    if (expireSeconds) {
      await this.redis.set(key, val, 'EX', expireSeconds);
    } else {
      await this.redis.set(key, val);
    }
  }

  async get(key: string) {
    const val = await this.redis.get(key);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }

  async keys(pattern: string) {
    return this.redis.keys(pattern);
  }
}
