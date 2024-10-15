import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Verify() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Card className="m-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Login</CardTitle>
          <CardDescription className="text-sm">
            We&apos;ve just sent you an email with a link to verify your login.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
          <span className="text-center text-sm text-muted-foreground">
            Awaiting verification...
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
