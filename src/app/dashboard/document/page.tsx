import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import DocumentClient from "./DocumentClient";

export default async function DocumentPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership?.orgId) {
    redirect("/onboarding");
  }

  const documents = await prisma.document.findMany({
    where: { orgId: membership.orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-950 p-8 font-sans text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="pb-6 border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-zinc-400 mt-1">Upload and manage organization knowledge</p>
        </header>

        <DocumentClient initialDocuments={documents} />
      </div>
    </div>
  );
}
