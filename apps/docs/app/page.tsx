import Link from "next/link";

import { Button } from "@/registry/new-york/ui/button/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-medium">Vinyaas</h1>
      <p>UI components installed into your project as source.</p>
      <p>
        <Link href="/components/button">Button</Link>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button>Save</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="outline" disabled>
          Cancel
        </Button>
        <Button size="lg">Save</Button>
      </div>
    </main>
  );
}
