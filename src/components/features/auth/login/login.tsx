"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

export const Login = () => {
  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, { callbackUrl: "/app" });
  };

  return (
    <Card className="m-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Login with your social provider</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => handleSocialLogin("google")}
          >
            Login with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
