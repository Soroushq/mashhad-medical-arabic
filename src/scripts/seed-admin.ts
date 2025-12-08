// File: src/scripts/seed-admin.ts
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import crypto from 'crypto';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mashhad_db',
  port: 3306,
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findFirst({
    where: { username: 'admin' }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Create admin
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashPassword('admin123'),
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true
    }
  });

  console.log('✅ Admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
