import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Extract required fields
    const method = request.method;
    const url = request.url;
    const correlationId = request['correlationId'];

    // Record start time
    const startTime = Date.now();

    return next.handle().pipe(
      // Use tap() to perform the logging side-effect upon completion
      tap(() => {
        const duration = Date.now() - startTime;

        this.logger.info(
          { correlationId, method, url, duration },
          'Request completed',
        );
      }),
    );
  }
}
