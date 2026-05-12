import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

let prismaInstance: PrismaClient | null = null;

export function getPrisma() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  return prismaInstance;
}
