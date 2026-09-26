/**
 * One environment variable required by the resolved registry graph.
 *
 * The registry contract is `envVars: Record<string, string>`. Every entry is
 * required. The string is a description for the developer, not a value to write.
 */
export interface EnvVarRequirement {
  name: string;
  description: string;
  configured: boolean;
}

export interface EnvInstallPlan {
  requirements: EnvVarRequirement[];
}
