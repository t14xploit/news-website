"use server";

import { prisma } from "@/lib/prisma";

export async function checkOrganizationMembership(
  userId: string,
  organizationId: string,
  requiredRoles: string[] = ["member", "admin", "owner"]
) {
  const membership = await prisma.member.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  const isValidMember =
    membership &&
    (requiredRoles.length === 0 ||
      (membership.role &&
        requiredRoles.some((role) => role === membership.role)));

  return {
    isMember: isValidMember,
    role: membership?.role,
    activeStatus: membership ? true : false,
  };
}
