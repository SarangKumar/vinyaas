import Link from "next/link";

import { githubUrl } from "@/components/docs-nav";
import { DocsNavLinks } from "@/components/docs-nav-links";

export function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-white text-gray-950">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-medium">
            Vinyaas
          </Link>
          <nav aria-label="Site" className="flex items-center gap-5 text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              Docs
            </Link>
            <Link href="/components" className="text-gray-600 hover:text-black">
              Components
            </Link>
            <a href={githubUrl} className="text-gray-600 hover:text-black">
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row">
        <aside className="hidden w-56 shrink-0 border-r border-gray-200 px-4 py-6 md:block">
          <DocsNavLinks className="flex flex-col gap-6" />
        </aside>
        <div className="min-w-0 flex-1">
          <details className="border-b border-gray-200 md:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
              Menu
            </summary>
            <DocsNavLinks className="flex flex-col gap-6 px-4 pb-4" />
          </details>
          {children}
        </div>
      </div>
    </div>
  );
}
