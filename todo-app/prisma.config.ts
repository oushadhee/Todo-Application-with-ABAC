import { defineConfig, env } from 'prisma/config';
import 'dotenv/config';  // Loads .env variables

export default defineConfig({
  schema: 'prisma/schema.prisma',  // Path to your schema file
  datasource: {
    url: env('DATABASE_URL'),  // References the env variable
  },
});