import { prisma } from "@/db/prisma";

async function main() {
  console.log("→ Merging 'see' → 'class-10'…");
  const seeCat = await prisma.category.findUnique({ where: { slug: "see" } });
  const class10 = await prisma.category.findUnique({ where: { slug: "class-10" } });

  if (seeCat && class10) {
    await prisma.post.updateMany({
      where: { categoryId: seeCat.id },
      data: { categoryId: class10.id },
    });
    await prisma.category.delete({ where: { id: seeCat.id } });
    console.log("  ✓ Merged 'see' into 'class-10'");
  } else if (seeCat && !class10) {
    // rename see to class-10
    await prisma.category.update({
      where: { id: seeCat.id },
      data: { slug: "class-10", name: "Class 10 - SEE" },
    });
    console.log("  ✓ Renamed 'see' → 'class-10'");
  } else {
    console.log("  - Skipped (no 'see' category)");
  }

  console.log("→ Merging 'ble' → 'class-8'…");
  const bleCat = await prisma.category.findUnique({ where: { slug: "ble" } });
  const class8 = await prisma.category.findUnique({ where: { slug: "class-8" } });

  if (bleCat && class8) {
    await prisma.post.updateMany({
      where: { categoryId: bleCat.id },
      data: { categoryId: class8.id },
    });
    await prisma.category.delete({ where: { id: bleCat.id } });
    console.log("  ✓ Merged 'ble' into 'class-8'");
  } else if (bleCat && !class8) {
    await prisma.category.update({
      where: { id: bleCat.id },
      data: { slug: "class-8", name: "Class 8 - BLE" },
    });
    console.log("  ✓ Renamed 'ble' → 'class-8'");
  } else {
    console.log("  - Skipped (no 'ble' category)");
  }

  console.log("→ Ensuring 'class-12' exists…");
  const class12 = await prisma.category.findUnique({ where: { slug: "class-12" } });
  if (!class12) {
    await prisma.category.create({
      data: {
        slug: "class-12",
        name: "Class 12 - NEB",
        description: "Class 12 notes, question answers, and study materials for NEB higher secondary subjects.",
        accentColor: "var(--cat-exam)",
        displayOrder: 10,
      },
    });
    console.log("  ✓ Created 'class-12'");
  } else {
    console.log("  - Already exists");
  }

  console.log("→ Updating category display names…");
  await prisma.category.updateMany({
    where: { slug: "class-10" },
    data: { name: "Class 10 - SEE" },
  });
  await prisma.category.updateMany({
    where: { slug: "class-8" },
    data: { name: "Class 8 - BLE" },
  });
  await prisma.category.updateMany({
    where: { slug: "class-12" },
    data: { name: "Class 12 - NEB" },
  });
  console.log("  ✓ Display names updated");

  console.log("\n✅ Category migration complete.");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
