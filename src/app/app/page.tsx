import { Navbar } from "@/components/features/shared/layout/navbar";
import { CreateCharacter } from "@/components/features/create-character/create-character";
import { getServerAuthSession } from "@/+server/auth/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">
      <Navbar session={session} />
      <CreateCharacter session={session} />
    </div>
  );
}
