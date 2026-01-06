import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",  // Correct for your local SQLite setup
  }),
  emailAndPassword: {
    enabled: true,
  },
});