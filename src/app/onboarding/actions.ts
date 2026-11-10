"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function joinOrganization(orgId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!org) {
    return { error: "Organization not found" };
  }

  
  const existingMembership = await prisma.membership.findUnique({
    where: {
      userId_orgId: {
        userId,
        orgId,
      },
    },
  });

  if (existingMembership) {
    return { error: "You are already a member of this organization" };
  }

  
  await prisma.membership.create({
    data: {
      userId,
      orgId,
      role: "MEMBER",
    },
  });

  revalidatePath("/dashboard");
  return { success: true, error: undefined };
}

export async function createOrganization(name: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  
  const org = await prisma.organization.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, orgId: org.id, error: undefined };
}
