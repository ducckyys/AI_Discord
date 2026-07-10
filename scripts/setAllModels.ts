import "dotenv/config";
import { prisma } from "../src/database/prisma";

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: tsx scripts/setAllModels.ts <model-id>");
    process.exit(2);
  }
  console.log(`Setting all guild settings.model => ${target}`);
  const result = await prisma.settings.updateMany({ data: { model: target } });
  console.log(`Updated ${result.count} rows.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
