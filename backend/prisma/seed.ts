import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      plan: 'PRO',
    },
  });
  
  console.log('✅ Created test user:', user.email);
  
  // Create test URL
  const url = await prisma.url.create({
    data: {
      shortCode: 'test123',
      originalUrl: 'https://example.com',
      userId: user.id,
      redirectType: 'PERMANENT',
    },
  });
  
  console.log('✅ Created test URL:', url.shortCode);
  
  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

