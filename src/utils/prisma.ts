// global prisma client to be used in the entire application
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
