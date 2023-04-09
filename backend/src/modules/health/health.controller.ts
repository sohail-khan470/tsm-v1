// backend/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';
import { S3HealthIndicator } from './s3.health';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private redisHealthIndicator: RedisHealthIndicator,
    private s3HealthIndicator: S3HealthIndicator,
  ) {}

  @Get('live')
  @HealthCheck()
  checkLiveness() {
    return this.healthCheckService.check([
      // Check heap usage is under 300MB (300 * 1024 * 1024 bytes)
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
    ]);
  }

  @Get('ready')
  @HealthCheck()
  checkReadiness() {
    return this.healthCheckService.check([
      // Check database connection
      () =>
        this.typeOrmHealthIndicator.pingCheck('database', { timeout: 5000 }),
      // Check Redis connection
      () => this.redisHealthIndicator.isHealthy('redis'),
      // Check S3 bucket existence
      () => this.s3HealthIndicator.isHealthy('s3'),
    ]);
  }
}
