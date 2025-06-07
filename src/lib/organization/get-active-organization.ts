import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getActiveOrganization(
  userId: string
): Promise<{ id: string } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            type: true,
          },
        },
        members: {
          include: {
            organization: true,
          },
          where: {
            role: { in: ["owner", "admin"] },
          },
          take: 1,
        },
      },
    });

    if (user?.members && user.members.length > 0) {
      return { id: user.members[0].organization.id };
    }

    if (user?.subscription?.type?.name === "Business") {
      const firstArticle = await prisma.article.findFirst({
        where: {
          authors: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          organizationId: true,
        },
      });

      if (firstArticle?.organizationId) {
        return { id: firstArticle.organizationId };
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching active organization:", error);
    return null;
  }
}
