// Seed the database with some initial data

import prisma from "@/utils/prisma";

async function seed() {
  await createAdmin();
}

async function createAdmin() {
  await prisma.secretary.create({
    data: {
      name: "Fernanda Lima",
      email: "fernanda@example.com",
      cpf: "992.960.180-56",
      password_hash: "123456",
      phone: "123456789",
    },
  });
}
