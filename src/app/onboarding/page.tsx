import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Check if user already has a membership
  const memberships = await prisma.membership.findMany({
    where: {
      userId: session.user.id,
    },
  });

  if (memberships.length > 0) {
    redirect("/dashboard");
  }

  return <OnboardingClient />;
}
