import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

console.log({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// export default new DataSource({
//     type: "postgres",
//     host: process.env.DATABASE_HOST || "localhost",
//     port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
//     username: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//     entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],
//     migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
//     synchronize: false, // Set to false when using migrations
// });
export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: [path.join(__dirname, '/../**/*.entity{.ts,.js}')],

  migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],

  synchronize: false,
});
