import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      role: "role",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Set default role to USER for new users
          return {
            ...user,
            role: "USER",
          };
        },
      },
    },
  },
});