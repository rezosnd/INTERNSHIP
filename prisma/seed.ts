import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const domains = [
  "Web Development",
  "App Development",
  "Full Stack Development",
  "Java Development",
  "Python Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Blockchain",
  "IoT",
  "Other"
];

async function main() {
  console.log("Starting seed...");
  for (const domain of domains) {
    await prisma.domain.upsert({
      where: { name: domain },
      update: {},
      create: {
        name: domain,
        description: `Internship project in ${domain}`,
      },
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
