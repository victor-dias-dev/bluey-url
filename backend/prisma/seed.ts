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
  
  const samples = [
    { shortCode: 'test123', originalUrl: 'https://example.com' },
    { shortCode: 'docs', originalUrl: 'https://github.com/victor-dias-dev/bluey-url' },
    { shortCode: 'nextjs', originalUrl: 'https://nextjs.org' },
    { shortCode: 'prisma', originalUrl: 'https://www.prisma.io' },
  ];

  for (const sample of samples) {
    const existingUrl = await prisma.url.findFirst({
      where: {
        shortCode: sample.shortCode,
        domainId: null,
        userId: user.id,
      },
    });

    if (!existingUrl) {
      await prisma.url.create({
        data: {
          shortCode: sample.shortCode,
          originalUrl: sample.originalUrl,
          userId: user.id,
          redirectType: 'PERMANENT',
        },
      });
    }

    console.log('✅ Created test URL:', sample.shortCode);
  }
  
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

