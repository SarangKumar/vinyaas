import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { DocsArticle } from "@/components/docs-article";
import { companionCustomPath } from "@/components/docs-nav";
import { focusRing } from "@/components/focus-ring";
import { pageMetadata } from "@/lib/page-metadata";
import emberMeta from "@/companion/ember/companion.json";

export const metadata: Metadata = pageMetadata({
  title: "companion.json",
  description:
    "Configure companion identity, animations, interactions, personality instances, and capabilities in companion.json.",
  path: "/companion/configuration",
});

const sectionHeading =
  "text-foreground scroll-mt-8 text-xl font-semibold tracking-tight";
const body = "text-foreground text-base leading-7";
const linkClass = `text-primary underline underline-offset-4 ${focusRing}`;

const example = JSON.stringify(emberMeta, null, 2);

export default function CompanionConfigurationPage() {
  return (
    <DocsArticle
      title="companion.json"
      description="Local metadata that drives the companion runtime — schema, animations, interactions, personality, and capabilities."
    >
      <section className="flex flex-col gap-4">
        <h2 id="architecture" className={sectionHeading}>
          Architecture
        </h2>
        <p className={body}>
          The docs companion runtime loads <code>companion.json</code>, resolves
          triggers, executes interaction actions, then updates the engine state
          machine and animation controller. The pipeline is:
        </p>
        <CodeBlock
          code={`companion.json
  → trigger resolver
  → interaction executor
  → runtime engine
  → renderer`}
          leading={
            <span className="text-muted-foreground font-mono text-xs">
              pipeline
            </span>
          }
        />
        <p className={body}>
          Triggers and actions are generic. Runtime code never branches on a
          companion id — behavior comes only from metadata.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="schema" className={sectionHeading}>
          Schema
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>id</code> / <code>name</code> / <code>type</code> — species
            identity (for example <code>flame</code> or <code>ghost</code>).
          </li>
          <li>
            <code>description</code> — short human-readable summary.
          </li>
          <li>
            <code>personalityTraits</code> — default personality tags for the
            species.
          </li>
          <li>
            <code>capabilities</code> — declared abilities such as{" "}
            <code>floating</code>, <code>followCursor</code>, and{" "}
            <code>reactToClick</code>.
          </li>
          <li>
            <code>interactions</code> — metadata-driven behaviors with trigger,
            action, animation, cooldown, and duration.
          </li>
          <li>
            <code>instances</code> — optional named profiles that override name,
            traits, mood bias, and behavior preferences without changing assets.
          </li>
          <li>
            <code>assets</code> / <code>animations</code> — sprite paths and
            clips.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="animations" className={sectionHeading}>
          Animations
        </h2>
        <p className={body}>
          Each entry under <code>animations</code> is a clip id mapped to either
          a frame path array or a clip object with <code>frames</code>, optional{" "}
          <code>fps</code>, and optional <code>loop</code>. Common roles:
        </p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>idle</code> — ambient loop while waiting.
          </li>
          <li>
            <code>happy</code> — short reaction / celebration one-shot.
          </li>
          <li>
            <code>sleep</code> — dozing loop.
          </li>
          <li>
            <code>fall</code> — falling loop while gravity runs.
          </li>
        </ul>
        <p className={body}>
          Paths are relative to the companion folder. The engine picks clips from
          runtime state and interaction metadata — not from companion-specific
          React branches.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="interactions" className={sectionHeading}>
          Interactions
        </h2>
        <p className={body}>
          Each interaction supports:
        </p>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>id</code> — stable interaction key.
          </li>
          <li>
            <code>trigger</code> —{" "}
            <code>
              click | double_click | idle_timeout | drag_start | drag_end | drop
              | cursor_nearby | page_navigation | manual
            </code>
            .
          </li>
          <li>
            <code>action</code> —{" "}
            <code>
              play_animation | change_state | jump | sleep | move
            </code>
            .
          </li>
          <li>
            <code>animation</code> — clip id to play.
          </li>
          <li>
            <code>cooldown</code> — milliseconds before the interaction can fire
            again.
          </li>
          <li>
            <code>duration</code> — how long the resulting behavior should last.
          </li>
          <li>
            <code>state</code> — optional target state for{" "}
            <code>change_state</code>.
          </li>
        </ul>
        <p className={body}>
          Legacy entries that only declare <code>id</code> and{" "}
          <code>description</code> are still accepted; the parser infers trigger
          and action from the id.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="personality" className={sectionHeading}>
          Personality
        </h2>
        <p className={body}>
          Species assets stay shared. Named <code>instances</code> override
          display name, traits, mood bias, and behavior preferences:
        </p>
        <CodeBlock
          code={`"instances": {
  "spark": {
    "name": "Spark",
    "moodBias": "excited",
    "behavior": { "energy": "high", "idleTimeoutMs": 2000 }
  },
  "ash": {
    "name": "Ash",
    "moodBias": "sleepy",
    "behavior": { "energy": "calm", "idleTimeoutMs": 4800 }
  }
}`}
          leading={
            <span className="text-muted-foreground font-mono text-xs">
              json
            </span>
          }
        />
        <p className={body}>
          Deterministic moods are <code>happy</code>, <code>neutral</code>,{" "}
          <code>sleepy</code>, and <code>excited</code>. Mood is derived from
          runtime state plus personality bias and can nudge idle timeout
          behavior. There is no AI in this path.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="capabilities" className={sectionHeading}>
          Capabilities
        </h2>
        <ul className={`${body} list-disc space-y-2 pl-5`}>
          <li>
            <code>floating</code> — reserved for soft hover presentation.
          </li>
          <li>
            <code>followCursor</code> — reserved for future trail behavior.
          </li>
          <li>
            <code>reactToClick</code> — gates click and double-click
            interactions in the executor.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="example" className={sectionHeading}>
          Example
        </h2>
        <p className={body}>
          Ember&apos;s built-in metadata (paths are relative to the companion
          folder):
        </p>
        <CodeBlock
          code={example}
          leading={
            <span className="text-muted-foreground font-mono text-xs">
              json
            </span>
          }
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 id="custom" className={sectionHeading}>
          Custom companions
        </h2>
        <p className={body}>
          For a future authoring workflow, see{" "}
          <Link href={companionCustomPath} className={linkClass}>
            Custom Companion
          </Link>
          .
        </p>
      </section>
    </DocsArticle>
  );
}
