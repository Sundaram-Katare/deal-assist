"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
    >
      Sign out
    </button>
  );
}
