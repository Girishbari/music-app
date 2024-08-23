"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useUserContextApp } from "@/context/UserContext";

export default function page() {
  const { toast } = useToast();
  const router = useRouter();

  const { setUserData } = useUserContextApp();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json();
        console.log(errorData);

        const errorMessage = errorData.error || "Cannot signin at a moment";
        throw new Error(errorMessage);
      }
      const response = await resp.json();
      console.log(response);

      setUserData({
        email: response.data.email,
        playlists: response.data.playlists,
        userId: response.data._id,
      });
      toast({
        title: "Login Sucessful",
        variant: "default",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive",
      });
      console.error("Error creating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Music2Icon className="h-12 w-12 text-primary" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
            <span className="bg-blue-300 px-1">Sign in</span> to your account
          </h1>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
          <div className="text-sm text-[#09080A]">
            Make an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/90"
              prefetch={false}
            >
              <span className="underline">Sign Up</span>
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
