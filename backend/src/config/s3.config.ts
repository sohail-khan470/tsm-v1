import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsEndpoint: process.env.AWS_ENDPOINT,
  bucket: process.env.S3_BUCKET,
  region: process.env.AWS_REGION,
}));

// AWS_ENDPOINT=http://localhost:4566
// AWS_REGION=us-east-1
// AWS_ACCESS_KEY_ID=test
// AWS_SECRET_ACCESS_KEY=test
// S3_BUCKET=taskmanager-attachments
