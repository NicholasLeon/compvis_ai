import { auth } from "@/auth"; // Sesuaikan path auth.js kamu
import NavLogin from "./navLogin";

export default async function Navbar() {
  const session = await auth();
  return <NavLogin user={session?.user} />;
}
