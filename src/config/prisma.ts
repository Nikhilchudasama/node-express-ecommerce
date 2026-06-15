import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.databaseUrl,
});

const adapter = new PrismaPg(pool);

const baseClient = new PrismaClient({ adapter });

export const prisma = baseClient.$extends({
  name: 'soft-delete',
  query: {
    product: {
      async findMany({ args, query }) {
        args.where = { ...(args.where ?? {}), deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...(args.where ?? {}), deletedAt: null };
        return query(args);
      },
      async findUnique({ args, query }) {
        args.where = { ...(args.where ?? {}), deletedAt: null };
        return query(args);
      },
      async count({ args, query }) {
        args.where = { ...(args.where ?? {}), deletedAt: null };
        return query(args);
      },
    },
  },
});

export type ExtendedPrismaClient = typeof prisma;
