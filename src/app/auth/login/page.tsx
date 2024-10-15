import { Navbar } from "@/components/features/shared/layout/navbar";
import { Login } from "@/components/features/auth/login/login";
import { getServerAuthSession } from "@/+server/auth/auth";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={session} />
      <Login />
    </div>
  );
}
