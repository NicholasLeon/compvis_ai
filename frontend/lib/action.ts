"use server";

import { signIn, signOut } from "@/auth";

export async function GoogleLogin() {
  await signIn("google", { redirectTo: "/" });
}

export async function Logout() {
  await signOut({ redirectTo: "/" });
}
