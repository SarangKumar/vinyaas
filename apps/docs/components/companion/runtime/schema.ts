/**
 * Typed companion.json schema + validation.
 * No companion-specific branches — any valid config can load.
 */

export type CompanionCapabilities = {
  floating: boolean;
  followCursor: boolean;
  reactToClick: boolean;
};

export type CompanionInteractionTrigger =
  | "click"
  | "double_click"
  | "idle_timeout"
  | "drag_start"
  | "drag_end"
  | "drop"
  | "cursor_nearby"
  | "page_navigation"
  | "manual";

export type CompanionInteractionAction =
  | "play_animation"
  | "change_state"
  | "jump"
  | "sleep"
  | "move";

export type CompanionMood = "happy" | "neutral" | "sleepy" | "excited";

export type CompanionEnergyPreference = "high" | "calm" | "balanced";

export type CompanionInteractionDefinition = {
  id: string;
  description?: string;
  trigger: CompanionInteractionTrigger;
  action: CompanionInteractionAction;
  /** Animation clip id to play (from animations map). */
  animation?: string;
  /** Optional runtime state target for change_state. */
  state?: string;
  /** Milliseconds before this interaction can fire again. */
  cooldown?: number;
  /** How long the resulting behavior should last (ms). */
  duration?: number;
};

export type CompanionInstanceBehavior = {
  energy?: CompanionEnergyPreference;
  idleTimeoutMs?: number;
  cursorNearbyRadius?: number;
};

export type CompanionInstanceProfile = {
  name?: string;
  personalityTraits?: string[];
  /** Preferred resting mood bias. */
  moodBias?: CompanionMood;
  behavior?: CompanionInstanceBehavior;
};

export type CompanionAnimationClipDefinition = {
  frames: string[];
  fps?: number;
  /** Defaults to true for ambient clips, false for one-shots when omitted. */
  loop?: boolean;
};

export type CompanionAnimationsDefinition = Record<
  string,
  string[] | CompanionAnimationClipDefinition
>;

export type CompanionConfig = {
  id: string;
  name: string;
  type?: string;
  description: string;
  personalityTraits: string[];
  capabilities: CompanionCapabilities;
  interactions: CompanionInteractionDefinition[];
  /** Optional named instances that override display/behavior (assets unchanged). */
  instances?: Record<string, CompanionInstanceProfile>;
  assets: { idle: string };
  animations: CompanionAnimationsDefinition;
};

export type CompanionConfigError = {
  ok: false;
  error: string;
  path?: string;
};

export type CompanionConfigSuccess = {
  ok: true;
  config: CompanionConfig;
};

export type CompanionConfigResult = CompanionConfigError | CompanionConfigSuccess;

const DEFAULT_FPS = 5;

const TRIGGERS = new Set<CompanionInteractionTrigger>([
  "click",
  "double_click",
  "idle_timeout",
  "drag_start",
  "drag_end",
  "drop",
  "cursor_nearby",
  "page_navigation",
  "manual",
]);

const ACTIONS = new Set<CompanionInteractionAction>([
  "play_animation",
  "change_state",
  "jump",
  "sleep",
  "move",
]);

const MOODS = new Set<CompanionMood>([
  "happy",
  "neutral",
  "sleepy",
  "excited",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeClip(
  value: unknown,
  path: string,
): CompanionAnimationClipDefinition | CompanionConfigError {
  if (Array.isArray(value)) {
    if (!value.every(isNonEmptyString) || value.length === 0) {
      return {
        ok: false,
        error: "Animation frames must be a non-empty string array.",
        path,
      };
    }
    return { frames: value, fps: DEFAULT_FPS };
  }

  if (!isRecord(value)) {
    return {
      ok: false,
      error: "Animation clip must be a frame array or clip object.",
      path,
    };
  }

  const frames = value.frames;
  if (
    !Array.isArray(frames) ||
    frames.length === 0 ||
    !frames.every(isNonEmptyString)
  ) {
    return {
      ok: false,
      error: "Animation clip.frames must be a non-empty string array.",
      path: `${path}.frames`,
    };
  }

  const fps =
    value.fps === undefined
      ? DEFAULT_FPS
      : typeof value.fps === "number" && value.fps > 0
        ? value.fps
        : null;

  if (fps === null) {
    return {
      ok: false,
      error: "Animation clip.fps must be a positive number when provided.",
      path: `${path}.fps`,
    };
  }

  if (value.loop !== undefined && typeof value.loop !== "boolean") {
    return {
      ok: false,
      error: "Animation clip.loop must be a boolean when provided.",
      path: `${path}.loop`,
    };
  }

  return {
    frames,
    fps,
    loop: value.loop as boolean | undefined,
  };
}

/** Infer rich interaction fields from legacy { id, description } entries. */
export function inferLegacyInteraction(
  id: string,
  description?: string,
): CompanionInteractionDefinition {
  const base = { id, description };

  switch (id) {
    case "react-click":
    case "celebrate":
    case "surprise":
    case "dance":
      return {
        ...base,
        trigger: "click",
        action: "play_animation",
        animation: "happy",
        cooldown: 900,
        duration: 1800,
      };
    case "jump":
      return {
        ...base,
        trigger: "double_click",
        action: "jump",
        animation: "happy",
        cooldown: 1200,
        duration: 1400,
      };
    case "sleep":
      return {
        ...base,
        trigger: "idle_timeout",
        action: "sleep",
        animation: "sleep",
        cooldown: 6000,
        duration: 4200,
      };
    case "wake":
      return {
        ...base,
        trigger: "click",
        action: "change_state",
        state: "idle",
        animation: "idle",
        cooldown: 400,
      };
    case "fall":
      return {
        ...base,
        trigger: "drop",
        action: "change_state",
        state: "falling",
        animation: "fall",
        cooldown: 0,
      };
    case "idle":
      return {
        ...base,
        trigger: "idle_timeout",
        action: "play_animation",
        animation: "idle",
        cooldown: 0,
        duration: 2800,
      };
    case "follow-cursor":
      return {
        ...base,
        trigger: "cursor_nearby",
        action: "play_animation",
        animation: "happy",
        cooldown: 2500,
        duration: 1200,
      };
    default:
      return {
        ...base,
        trigger: "manual",
        action: "play_animation",
        animation: "idle",
        cooldown: 0,
      };
  }
}

function parseInteraction(
  item: unknown,
  path: string,
): CompanionInteractionDefinition | CompanionConfigError {
  if (!isRecord(item) || !isNonEmptyString(item.id)) {
    return {
      ok: false,
      error: "Each interaction needs a string id.",
      path,
    };
  }

  const description = isNonEmptyString(item.description)
    ? item.description
    : undefined;

  // Legacy shape: only id (+ optional description).
  if (item.trigger === undefined && item.action === undefined) {
    if (description === undefined) {
      return {
        ok: false,
        error: "Legacy interactions need a description string.",
        path,
      };
    }
    return inferLegacyInteraction(item.id, description);
  }

  if (!isNonEmptyString(item.trigger) || !TRIGGERS.has(item.trigger as CompanionInteractionTrigger)) {
    return {
      ok: false,
      error:
        "interaction.trigger must be one of click, double_click, idle_timeout, drag_start, drag_end, drop, cursor_nearby, page_navigation, manual.",
      path: `${path}.trigger`,
    };
  }

  if (!isNonEmptyString(item.action) || !ACTIONS.has(item.action as CompanionInteractionAction)) {
    return {
      ok: false,
      error:
        "interaction.action must be one of play_animation, change_state, jump, sleep, move.",
      path: `${path}.action`,
    };
  }

  if (item.animation !== undefined && !isNonEmptyString(item.animation)) {
    return {
      ok: false,
      error: "interaction.animation must be a string when provided.",
      path: `${path}.animation`,
    };
  }

  if (item.state !== undefined && !isNonEmptyString(item.state)) {
    return {
      ok: false,
      error: "interaction.state must be a string when provided.",
      path: `${path}.state`,
    };
  }

  if (
    item.cooldown !== undefined &&
    (typeof item.cooldown !== "number" || item.cooldown < 0)
  ) {
    return {
      ok: false,
      error: "interaction.cooldown must be a non-negative number.",
      path: `${path}.cooldown`,
    };
  }

  if (
    item.duration !== undefined &&
    (typeof item.duration !== "number" || item.duration < 0)
  ) {
    return {
      ok: false,
      error: "interaction.duration must be a non-negative number.",
      path: `${path}.duration`,
    };
  }

  return {
    id: item.id,
    description,
    trigger: item.trigger as CompanionInteractionTrigger,
    action: item.action as CompanionInteractionAction,
    animation: item.animation as string | undefined,
    state: item.state as string | undefined,
    cooldown: item.cooldown as number | undefined,
    duration: item.duration as number | undefined,
  };
}

function parseInstanceProfile(
  item: unknown,
  path: string,
): CompanionInstanceProfile | CompanionConfigError {
  if (!isRecord(item)) {
    return { ok: false, error: "Instance profile must be an object.", path };
  }

  if (item.name !== undefined && !isNonEmptyString(item.name)) {
    return {
      ok: false,
      error: "instance.name must be a string.",
      path: `${path}.name`,
    };
  }

  if (
    item.personalityTraits !== undefined &&
    (!Array.isArray(item.personalityTraits) ||
      !item.personalityTraits.every(isNonEmptyString))
  ) {
    return {
      ok: false,
      error: "instance.personalityTraits must be a string array.",
      path: `${path}.personalityTraits`,
    };
  }

  if (
    item.moodBias !== undefined &&
    (!isNonEmptyString(item.moodBias) || !MOODS.has(item.moodBias as CompanionMood))
  ) {
    return {
      ok: false,
      error: "instance.moodBias must be happy, neutral, sleepy, or excited.",
      path: `${path}.moodBias`,
    };
  }

  let behavior: CompanionInstanceBehavior | undefined;
  if (item.behavior !== undefined) {
    if (!isRecord(item.behavior)) {
      return {
        ok: false,
        error: "instance.behavior must be an object.",
        path: `${path}.behavior`,
      };
    }
    const energy = item.behavior.energy;
    if (
      energy !== undefined &&
      energy !== "high" &&
      energy !== "calm" &&
      energy !== "balanced"
    ) {
      return {
        ok: false,
        error: "instance.behavior.energy must be high, calm, or balanced.",
        path: `${path}.behavior.energy`,
      };
    }
    if (
      item.behavior.idleTimeoutMs !== undefined &&
      (typeof item.behavior.idleTimeoutMs !== "number" ||
        item.behavior.idleTimeoutMs <= 0)
    ) {
      return {
        ok: false,
        error: "instance.behavior.idleTimeoutMs must be a positive number.",
        path: `${path}.behavior.idleTimeoutMs`,
      };
    }
    if (
      item.behavior.cursorNearbyRadius !== undefined &&
      (typeof item.behavior.cursorNearbyRadius !== "number" ||
        item.behavior.cursorNearbyRadius <= 0)
    ) {
      return {
        ok: false,
        error: "instance.behavior.cursorNearbyRadius must be a positive number.",
        path: `${path}.behavior.cursorNearbyRadius`,
      };
    }
    behavior = {
      energy: energy as CompanionEnergyPreference | undefined,
      idleTimeoutMs: item.behavior.idleTimeoutMs as number | undefined,
      cursorNearbyRadius: item.behavior.cursorNearbyRadius as number | undefined,
    };
  }

  return {
    name: item.name as string | undefined,
    personalityTraits: item.personalityTraits as string[] | undefined,
    moodBias: item.moodBias as CompanionMood | undefined,
    behavior,
  };
}

/** Default loop policy when companion.json omits `loop`. */
export function defaultClipLoop(clipId: string): boolean {
  return clipId === "idle" || clipId === "sleep";
}

export function resolveClipDefinition(
  animations: CompanionAnimationsDefinition,
  clipId: string,
): CompanionAnimationClipDefinition | null {
  const raw = animations[clipId];
  if (!raw) {
    return null;
  }

  if (Array.isArray(raw)) {
    return {
      frames: raw,
      fps: DEFAULT_FPS,
      loop: defaultClipLoop(clipId),
    };
  }

  return {
    frames: raw.frames,
    fps: raw.fps ?? DEFAULT_FPS,
    loop: raw.loop ?? defaultClipLoop(clipId),
  };
}

/**
 * Validate unknown JSON into a CompanionConfig.
 * Returns a structured error instead of throwing.
 */
export function parseCompanionConfig(raw: unknown): CompanionConfigResult {
  if (!isRecord(raw)) {
    return { ok: false, error: "Companion config must be an object." };
  }

  if (!isNonEmptyString(raw.id)) {
    return { ok: false, error: "Companion id is required.", path: "id" };
  }
  if (!isNonEmptyString(raw.name)) {
    return { ok: false, error: "Companion name is required.", path: "name" };
  }
  if (!isNonEmptyString(raw.description)) {
    return {
      ok: false,
      error: "Companion description is required.",
      path: "description",
    };
  }

  if (
    !Array.isArray(raw.personalityTraits) ||
    !raw.personalityTraits.every(isNonEmptyString)
  ) {
    return {
      ok: false,
      error: "personalityTraits must be an array of strings.",
      path: "personalityTraits",
    };
  }

  if (!isRecord(raw.capabilities)) {
    return {
      ok: false,
      error: "capabilities must be an object.",
      path: "capabilities",
    };
  }

  const capabilities: CompanionCapabilities = {
    floating: Boolean(raw.capabilities.floating),
    followCursor: Boolean(raw.capabilities.followCursor),
    reactToClick: Boolean(raw.capabilities.reactToClick),
  };

  if (!Array.isArray(raw.interactions)) {
    return {
      ok: false,
      error: "interactions must be an array.",
      path: "interactions",
    };
  }

  const interactions: CompanionInteractionDefinition[] = [];
  for (let i = 0; i < raw.interactions.length; i++) {
    const parsed = parseInteraction(
      raw.interactions[i],
      `interactions[${i}]`,
    );
    if ("ok" in parsed && parsed.ok === false) {
      return parsed;
    }
    interactions.push(parsed as CompanionInteractionDefinition);
  }

  let instances: Record<string, CompanionInstanceProfile> | undefined;
  if (raw.instances !== undefined) {
    if (!isRecord(raw.instances)) {
      return {
        ok: false,
        error: "instances must be an object map.",
        path: "instances",
      };
    }
    instances = {};
    for (const [key, value] of Object.entries(raw.instances)) {
      const profile = parseInstanceProfile(value, `instances.${key}`);
      if ("ok" in profile && profile.ok === false) {
        return profile;
      }
      instances[key] = profile as CompanionInstanceProfile;
    }
  }

  if (!isRecord(raw.assets) || !isNonEmptyString(raw.assets.idle)) {
    return {
      ok: false,
      error: "assets.idle is required.",
      path: "assets.idle",
    };
  }

  if (!isRecord(raw.animations)) {
    return {
      ok: false,
      error: "animations must be an object.",
      path: "animations",
    };
  }

  const animations: CompanionAnimationsDefinition = {};
  for (const [clipId, value] of Object.entries(raw.animations)) {
    const clip = normalizeClip(value, `animations.${clipId}`);
    if ("ok" in clip && clip.ok === false) {
      return clip;
    }
    animations[clipId] = clip as CompanionAnimationClipDefinition;
  }

  if (!animations.idle) {
    return {
      ok: false,
      error: "animations.idle is required.",
      path: "animations.idle",
    };
  }

  return {
    ok: true,
    config: {
      id: raw.id,
      name: raw.name,
      type: isNonEmptyString(raw.type) ? raw.type : undefined,
      description: raw.description,
      personalityTraits: raw.personalityTraits as string[],
      capabilities,
      interactions,
      instances,
      assets: { idle: raw.assets.idle as string },
      animations,
    },
  };
}

export function assertCompanionConfig(raw: unknown): CompanionConfig {
  const result = parseCompanionConfig(raw);
  if (!result.ok) {
    throw new Error(
      result.path
        ? `Invalid companion config at ${result.path}: ${result.error}`
        : `Invalid companion config: ${result.error}`,
    );
  }
  return result.config;
}

/** Compat helper for tests/catalog that only need frames + fps. */
export function normalizeAnimationClipCompat(
  value: string[] | CompanionAnimationClipDefinition | undefined,
  fallbackFps = 5,
): { frames: string[]; fps: number } {
  if (!value) {
    return { frames: [], fps: fallbackFps };
  }

  if (Array.isArray(value)) {
    return { frames: value, fps: fallbackFps };
  }

  return {
    frames: value.frames ?? [],
    fps: value.fps ?? fallbackFps,
  };
}
