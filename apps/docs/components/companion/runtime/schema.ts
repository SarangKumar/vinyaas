/**
 * Typed companion.json schema + validation.
 * No companion-specific branches — any valid config can load.
 */

export type CompanionCapabilities = {
  floating: boolean;
  followCursor: boolean;
  reactToClick: boolean;
};

export type CompanionInteractionDefinition = {
  id: string;
  description: string;
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
  if (!Array.isArray(frames) || frames.length === 0 || !frames.every(isNonEmptyString)) {
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
    const item = raw.interactions[i];
    if (!isRecord(item) || !isNonEmptyString(item.id) || !isNonEmptyString(item.description)) {
      return {
        ok: false,
        error: "Each interaction needs id and description strings.",
        path: `interactions[${i}]`,
      };
    }
    interactions.push({ id: item.id, description: item.description });
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
