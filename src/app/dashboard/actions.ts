"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function submitFeedback(rating: number, text: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.feedback.create({
    data: {
      userId: session.user.id,
      rating,
      text: text || null,
    }
  });

  return { success: true };
}
