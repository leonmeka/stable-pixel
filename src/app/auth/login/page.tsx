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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const SCHEMA = z.object({
  email: z.string().email(),
});

export default function Login() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof SCHEMA>) => {
    setIsPending(true);

    await signIn("email", {
      email: values.email,
      callbackUrl: "/",
    });

    setIsPending(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Card className="m-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Login with your email address or social provider.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isPending}
                disabled
                /*                 disabled={!form.formState.isValid || isPending}
                 */
              >
                Login
              </Button>
            </form>
          </Form>

          <hr />

          <div className="space-y-2">
            <Button
              className="w-full"
              variant="secondary"
              disabled
              onClick={() => void signIn("google", { callbackUrl: "/" })}
            >
              Login with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
