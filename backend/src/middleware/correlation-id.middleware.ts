import { Injectable, NestMiddleware } from '@nestjs/common';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable() // Best practice: NestJS middlewares should be decorated with @Injectable
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Read existing header OR fallback to a fresh random UUID string
    const correlationId =
      (req.headers['x-correlation-id'] as string) || crypto.randomUUID();

    // 2. Attach it to the request object for downstream usage
    req['correlationId'] = correlationId;

    // 3. Set the response header (TypeScript is happy because it is guaranteed to be a string)
    res.setHeader('x-correlation-id', correlationId);

    // 4. Move to the next middleware/handler exactly once
    next();
  }
}
