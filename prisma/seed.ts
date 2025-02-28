// Seed the database with some initial data

import prisma from "@/utils/prisma";

async function seed() {
  await createAdmin();
}

async function createAdmin() {
  //   await prisma.user.upsert({});
}
