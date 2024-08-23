"use client";
import { toast } from "@/components/ui/use-toast";
import { Music2Icon } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast({
      variant: "default",
      title: "Cannot get all songs",
    });
  }, []);
  return (
    <div className="mx-auto h-full w-full max-w-md pt-32">
      <div className="flex flex-col items-center justify-center">
        <Music2Icon className="h-12 w-12 text-primary" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Oops! Something went wrong
        </h1>
      </div>
      <div className="space-y-6 text-center">
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}
