import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/logging.interceptor';
import './telemetry/tracing';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  const pinoLogger = app.get(PinoLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(pinoLogger));
  app.enableCors({ origin: '*', credentials: true });
  app.use(helmet());
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3600);
}
bootstrap();
