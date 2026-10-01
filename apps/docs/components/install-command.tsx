"use client";

import { useEffect, useState } from "react";

import { CodeBlock } from "@/components/code-block";
import { focusRing } from "@/components/focus-ring";
import {
  packageManagers,
  type PackageManager,
  type PackageManagerCommands,
} from "@/components/package-managers";

export {
  cliCommands,
  createNextAppCommands,
  createViteAppCommands,
  packageInstallCommands,
  packageManagers,
  type PackageManager,
  type PackageManagerCommands,
} from "@/components/package-managers";

const storageKey = "vinyaas-package-manager";
const changeEvent = "vinyaas-package-manager-change";

function isPackageManager(value: string | null): value is PackageManager {
  return packageManagers.some((manager) => manager === value);
}

function remember(manager: PackageManager) {
  window.sessionStorage.setItem(storageKey, manager);
  window.dispatchEvent(new CustomEvent(changeEvent, { detail: manager }));
}

export function InstallCommand({
  commands,
}: {
  commands: PackageManagerCommands;
}) {
  const [manager, setManager] = useState<PackageManager>("npm");

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<PackageManager>).detail;

      if (isPackageManager(detail)) {
        setManager(detail);
      }
    };

    window.addEventListener(changeEvent, onChange);
    const timeout = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem(storageKey);

      if (isPackageManager(stored)) {
        setManager(stored);
      }
    }, 0);

    return () => {
      window.removeEventListener(changeEvent, onChange);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <CodeBlock
      language="bash"
      code={commands[manager]}
      leading={
        <div
          role="tablist"
          aria-label="Package manager"
          className="flex flex-wrap gap-1"
        >
          {packageManagers.map((name) => {
            const selected = manager === name;

            return (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? `bg-muted text-foreground cursor-pointer rounded-md px-2 py-1 text-xs font-medium ${focusRing}`
                    : `text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md px-2 py-1 text-xs ${focusRing}`
                }
                onClick={() => {
                  setManager(name);
                  remember(name);
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      }
    />
  );
}
