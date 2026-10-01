"use client";

import { useMemo, useState } from "react";

import {
  PlaygroundBlock,
  PlaygroundContent,
  PlaygroundGrid,
  PlaygroundHeader,
  usePrintFromScroll,
} from "@/components/playground";

import { typesetExamples } from "./examples";
import { TypesetControls } from "./typeset-controls";
import {
  defaultTypesetConfig,
  generateTypesetCss,
  nextTypesetPreset,
  typesetPreviewStyle,
  type TypesetConfig,
} from "./typeset-config";

export function TypesetPlayground() {
  const [config, setConfig] = useState<TypesetConfig>(defaultTypesetConfig);
  usePrintFromScroll(true);

  const copyValue = useMemo(() => generateTypesetCss(config), [config]);

  return (
    <div className="from-muted/40 via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex w-full min-w-0 flex-col bg-linear-to-b px-4 py-7 [--gap:var(--playground-gap)] sm:px-6 sm:py-8 md:px-8 md:[--gap:var(--playground-gap-md)] lg:px-12 xl:px-16 xl:[--gap:var(--playground-gap-xl)] 2xl:px-20">
      <PlaygroundContent>
        <PlaygroundHeader
          title="Typeset"
          description="Playground for measure, fonts, size, leading, and flow on Markdown-style content. For concepts and setup, see the Typeset docs."
        />
        <TypesetControls
          config={config}
          copyValue={copyValue}
          onChange={setConfig}
          onShuffle={() => setConfig((current) => nextTypesetPreset(current))}
        />
        <div
          data-typeset-playground
          data-typeset-measure={config.measure}
          data-typeset-size={config.size}
          data-typeset-leading={config.leading}
          data-typeset-flow={config.flow}
          className="bg-background text-foreground w-full min-w-0 rounded-2xl"
          style={typesetPreviewStyle(config)}
        >
          <PlaygroundGrid>
            {typesetExamples.map((example) => (
              <PlaygroundBlock
                key={example.id}
                title={example.title}
                description={example.description}
              >
                {example.preview}
              </PlaygroundBlock>
            ))}
          </PlaygroundGrid>
        </div>
      </PlaygroundContent>
    </div>
  );
}
