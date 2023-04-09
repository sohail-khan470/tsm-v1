// backend/src/health/indicators/redis.health.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator implements OnModuleDestroy {
  private redisClient: Redis;

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly configService: ConfigService,
  ) {
    const redisConfig = this.configService.get('redis');
    this.redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 100, 1000);
      },
    });
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    const startTime = Date.now();
    const redisConfig = this.configService.get('redis');

    try {
      const response = await this.redisClient.ping();
      const latency = Date.now() - startTime;

      if (response !== 'PONG') {
        return indicator.down({
          message: 'Redis did not respond with PONG',
          response,
          latency: `${latency}ms`,
        });
      }

      return indicator.up({
        message: 'Redis is up and running',
        latency: `${latency}ms`,
        host: redisConfig.host,
        port: redisConfig.port,
      });
    } catch (error: unknown) {
      let errorMessage = 'Unknown error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      const latency = Date.now() - startTime;

      return indicator.down({
        message: 'Redis health check failed',
        error: errorMessage,
        host: redisConfig.host,
        port: redisConfig.port,
        latency: `${latency}ms`,
      });
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
