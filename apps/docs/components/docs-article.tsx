import { Fragment, type ReactNode } from "react";

import { ChevronRightIcon } from "@/components/icons";
import { docsMutedBodyClassName } from "@/components/docs-prose";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb";

export type BreadcrumbEntry = { label: string; href?: string };

export function DocsArticle({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbEntry[];
  children?: ReactNode;
}) {
  return (
    <article
      data-docs-article
      className="text-foreground max-w-3.5xl mx-auto flex w-full min-w-0 flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10"
    >
      <header className="flex flex-col gap-3 sm:gap-4">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, i) => (
                <Fragment key={crumb.label}>
                  {i > 0 ? (
                    <BreadcrumbSeparator>
                      <ChevronRightIcon className="size-3.5" />
                    </BreadcrumbSeparator>
                  ) : null}
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
        <h1 className="text-foreground text-[clamp(1.75rem,5.5vw,1.875rem)] font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className={`${docsMutedBodyClassName} text-pretty`}>
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </article>
  );
}
