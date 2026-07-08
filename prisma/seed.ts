import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

async function main() {
  const { prisma } = await import('../lib/prisma');
  const existing = await prisma.crmUser.findUnique({ where: { email: 'info@immisa.ca' } });
  if (existing) {
    console.log('Seed user already exists, skipping.');
    return;
  }
  await prisma.crmUser.create({
    data: {
      name: 'Sumbal Anees',
      email: 'info@immisa.ca',
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
      role: 'admin',
      department: 'Immigration',
    },
  });
  console.log('Seeded CrmUser: Sumbal Anees (info@immisa.ca)');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
