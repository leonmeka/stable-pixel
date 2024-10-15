import { Navbar } from "@/components/features/shared/layout/navbar";
import { Login } from "@/components/features/auth/login/login";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={null} />
      <Login />
    </div>
  );
}
