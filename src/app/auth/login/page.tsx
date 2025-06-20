import { Navbar } from "@/components/features/shared/layout/navbar";
import { Login } from "@/components/features/auth/login/login";
import { getServerAuthSession } from "@/+server/auth/auth";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">
      <Navbar session={session} />

      <div className="grid h-full w-full items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
