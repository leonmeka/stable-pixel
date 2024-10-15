import { getServerSession } from "next-auth";

import { Navbar } from "@/components/features/shared/layout/navbar";
import { CreateCharacter } from "@/components/features/create-character/create-character";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={session} />
      <CreateCharacter session={session} />
    </div>
  );
}
