// backend/src/health/indicators/s3.health.ts
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class S3HealthIndicator {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly configService: ConfigService,
  ) {
    const s3Config = this.configService.get('s3');

    this.s3Client = new S3Client({
      endpoint: s3Config.endpoint,
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      forcePathStyle: true, // Required for LocalStack
    });

    this.bucketName = s3Config.bucket;
  }

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);
    const startTime = Date.now();

    try {
      const command = new HeadBucketCommand({
        Bucket: this.bucketName,
      });

      await this.s3Client.send(command);
      const latency = Date.now() - startTime;

      return indicator.up({
        message: 'S3 bucket is accessible',
        bucket: this.bucketName,
        latency: `${latency}ms`,
      });
    } catch (error: unknown) {
      let errorMessage = 'Unknown error occurred';
      let errorCode: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        if ('code' in error) {
          errorCode = (error as any).code;
        }
      }

      const latency = Date.now() - startTime;

      return indicator.down({
        message: 'S3 health check failed',
        error: errorMessage,
        errorCode,
        bucket: this.bucketName,
        endpoint: this.configService.get('s3.endpoint'),
        latency: `${latency}ms`,
      });
    }
  }
}
