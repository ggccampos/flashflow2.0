import path from 'path';
import { PrismaClient } from '@prisma/client';

const rawDatabaseUrl = process.env.DATABASE_URL;
if (rawDatabaseUrl?.startsWith('file:')) {
  const filePath = rawDatabaseUrl.slice('file:'.length);
  if (!path.isAbsolute(filePath)) {
    const projectRoot = path.resolve(__dirname, '../../');
    const prismaDir = path.resolve(projectRoot, 'prisma');
    process.env.DATABASE_URL = `file:${path.resolve(prismaDir, filePath)}`;
  }
}

const prisma = new PrismaClient();

export async function initializeDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Connected to Prisma database');
  } catch (error) {
    console.error('Error connecting to Prisma database:', error);
    throw error;
  }
}

export default prisma;
