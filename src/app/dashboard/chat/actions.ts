"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getConversations() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    throw new Error("User must belong to an organization.");
  }

  const conversations = await prisma.conversation.findMany({
    where: { orgId: membership.orgId },
    orderBy: { createdAt: 'desc' },
  });

  return conversations;
}

export async function getConversationMessages(chatId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    throw new Error("User must belong to an organization.");
  }

  // Ensure the conversation belongs to the user's organization
  const conversation = await prisma.conversation.findFirst({
    where: { 
      id: chatId,
      orgId: membership.orgId
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!conversation) {
    throw new Error("Conversation not found or unauthorized");
  }

  return conversation.messages;
}

export async function createConversation(title?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    throw new Error("User must belong to an organization.");
  }

  const newChat = await prisma.conversation.create({
    data: {
      orgId: membership.orgId,
      userId: session.user.id,
      title: title || "New Chat",
    }
  });

  return newChat.id;
}
