/**
 * Seed script — populates defaults:
 *   - SiteSettings row (id=1)
 *   - Default Author "Subesh Yadav"
 *   - Default Categories (mirroring lib/blog/categories.ts)
 *   - Initial Admin User (from ADMIN_EMAIL/ADMIN_PASSWORD/ADMIN_NAME env)
 *
 * Run with:  npx prisma db seed
 * (configured in package.json's `prisma.seed` key)
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mirror of lib/blog/categories.ts — keep in sync when categories change.
const DEFAULT_CATEGORIES: Array<{
  slug: string;
  name: string;
  description: string;
  accentColor: string;
  displayOrder: number;
}> = [
  {
    slug: "essays",
    name: "Essays",
    description:
      "Nepali essays and nibandha on culture, society, education, and everyday life.",
    accentColor: "var(--cat-essay)",
    displayOrder: 1,
  },
  {
    slug: "poems",
    name: "Poems",
    description: "A collection of Nepali poems and kabita.",
    accentColor: "var(--cat-poem)",
    displayOrder: 2,
  },
  {
    slug: "shayari",
    name: "Shayari & Gajal",
    description: "Nepali shayari, gajal, and short expressive verses.",
    accentColor: "var(--cat-shayari)",
    displayOrder: 3,
  },
  {
    slug: "stories",
    name: "Stories",
    description: "Nepali short stories and laghukatha.",
    accentColor: "var(--cat-story)",
    displayOrder: 4,
  },
  {
    slug: "class-7",
    name: "Class 7",
    description: "Class 7 study materials and notes.",
    accentColor: "var(--cat-exam)",
    displayOrder: 5,
  },
  {
    slug: "class-8",
    name: "Class 8 - BLE",
    description: "BLE (Basic Level Examination) practice questions and study notes for Class 8 students.",
    accentColor: "var(--cat-exam)",
    displayOrder: 6,
  },
  {
    slug: "class-9",
    name: "Class 9",
    description: "Class 9 practice questions and study resources.",
    accentColor: "var(--cat-exam)",
    displayOrder: 7,
  },
  {
    slug: "class-10",
    name: "Class 10 - SEE",
    description: "SEE practice questions, model sets, and revision notes for Secondary Education Examination preparation.",
    accentColor: "var(--cat-exam)",
    displayOrder: 8,
  },
  {
    slug: "class-11",
    name: "Class 11",
    description: "Class 11 notes and study materials for NEB.",
    accentColor: "var(--cat-exam)",
    displayOrder: 9,
  },
  {
    slug: "class-12",
    name: "Class 12 - NEB",
    description: "Class 12 notes, question answers, and study materials for NEB higher secondary subjects.",
    accentColor: "var(--cat-exam)",
    displayOrder: 10,
  },
  {
    slug: "reviews",
    name: "Reviews",
    description: "Book reviews and recommendations.",
    accentColor: "var(--cat-review)",
    displayOrder: 12,
  },
];

async function main() {
  console.log("→ Seeding SiteSettings…");
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Subesh Yadav",
      tagline: "Portfolio and writing by Subesh Yadav.",
    },
  });

  console.log("→ Seeding default Author…");
  const defaultAuthor = await prisma.author.upsert({
    where: { slug: "subesh-yadav" },
    update: {},
    create: {
      slug: "subesh-yadav",
      name: "Subesh Yadav",
      bio: "Writer and educator sharing Nepali essays, poems, and study materials.",
      websiteUrl: "https://subeshyadav.com.np",
      social: {
        github: "https://github.com/subeshyadav3",
        linkedin: "https://www.linkedin.com/in/subeshyadav",
      },
    },
  });

  console.log("→ Seeding default Categories…");
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        accentColor: cat.accentColor,
        displayOrder: cat.displayOrder,
      },
      create: cat,
    });
  }

  // Initial admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Subesh Yadav";

  if (adminEmail && adminPassword) {
    console.log(`→ Seeding admin user (${adminEmail})…`);
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: Role.ADMIN, hashedPassword, name: adminName },
      create: {
        email: adminEmail,
        name: adminName,
        role: Role.ADMIN,
        hashedPassword,
      },
    });
  } else {
    console.warn(
      "⚠ ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed."
    );
  }

  // Link the default author to the admin user if both exist
  if (adminEmail) {
    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (adminUser) {
      await prisma.author.update({
        where: { id: defaultAuthor.id },
        data: { name: adminUser.name ?? defaultAuthor.name },
      });
    }
  }

  console.log("✓ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
