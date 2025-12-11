import HeroScanner from "./components/hero";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  const userIsLoggedIn = !!session?.user;
  return (
    <main>
      <HeroScanner isLoggedIn={userIsLoggedIn} />;
    </main>
  );
}
