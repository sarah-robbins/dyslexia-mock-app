// Add this to your db.ts file
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    // Add connection pool settings for Supabase
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Add connection cleanup
process.on('beforeExit', () => {
  void prisma.$disconnect();
});

process.on('SIGINT', () => {
  void prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  void prisma.$disconnect();
  process.exit(0);
});
