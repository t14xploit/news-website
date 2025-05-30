import "dotenv/config";
// import path from "path";
// import { fileURLToPath } from "url";

// __dirname shim so this can be run directly via tsx/ts-node
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// import your built code via relative paths
import { PrismaClient } from "../src/generated/prisma";
import { auth } from "../src/lib/auth";

import { init as cuidInit } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

const makeId = cuidInit({
  length: 10,
  random: Math.random,
  fingerprint: "seed-script",
});

interface AdminToSeed {
  email: string;
  name: string;
  password: string;
}

const ADMINS: AdminToSeed[] = [
  {
    email: "atf@admin.io",
    name: "SuperAdmin",
    password: "DevAdmin999@",
  },
];

async function main() {
  const ctx = await auth.$context;

  for (const { email, name, password } of ADMINS) {
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      if (user.role !== "admin" || !user.emailVerified) {
        await prisma.user.update({
          where: { email },
          data: {
            role: "admin",
            emailVerified: true,
          },
        });
        console.log(`Promoted to admin + verified: ${email} / ${password}`);
      } else {
        console.log(`Already admin + verified: ${email} / ${password}`);
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: "admin",
          emailVerified: true,
        },
      });
      console.log(`✅ Created new admin user: ${email} / ${password}`);
    }

    const hashed = await ctx.password.hash(password);

    await prisma.account.deleteMany({
      where: {
        providerId: "credential",
        accountId: email,
      },
    });

    await prisma.account.create({
      data: {
        id: makeId(),
        providerId: "credential",
        accountId: email,
        userId: user.id,
        password: hashed,
      },
    });

    console.log(`🔐 Seeded credential account for ${email} / ${password}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
