import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Get user's membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      org: true,
    },
  });

  if (!membership) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Welcome back, {session.user.name || session.user.email}</p>
          </div>
          <LogoutButton />
        </header>

        <main className="grid gap-6">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">Organization Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-zinc-400">Organization Name</span>
                <span className="font-medium">{membership.org.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-zinc-400">Organization ID (Invite Code)</span>
                <span className="font-mono text-sm bg-black/50 px-2 py-1 rounded text-blue-400">
                  {membership.org.id}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-zinc-400">Your Role</span>
                <span className="font-medium text-purple-400">{membership.role}</span>
              </div>

              <Link href={"/dashboard/chat"}>
                Chats
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
