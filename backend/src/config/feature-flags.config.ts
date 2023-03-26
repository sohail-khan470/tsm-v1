import { registerAs } from '@nestjs/config';

export default registerAs('features', () => ({
  reportGeneration: process.env.FEATURE_REPORT_GENERATION === 'true',
}));

// FEATURE_REPORT_GENERATION = true;
