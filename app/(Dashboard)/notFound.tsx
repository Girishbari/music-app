"use client";
import { Music2Icon } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: any) {
  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="flex flex-col items-center justify-center">
        <Music2Icon className="h-12 w-12 text-primary" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Oops!
        </h1>
      </div>
      <div className="space-y-6 text-center">
        <p className="text-muted-foreground">For some reason {error.message}</p>
        {/*    <Link
            href="#"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            prefetch={false}
          >
            Go back home
          </Link> */}
      </div>
    </div>
  );
}
