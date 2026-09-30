/** Local install record for one registry component. */
export interface ManifestComponent {
  files: string[];
  /** ISO calendar date (YYYY-MM-DD) when Vinyaas last wrote this component. */
  installedAt: string;
}

/**
 * Project-local install state owned by Vinyaas.
 * Separate from components.json (consumer configuration).
 */
export interface VinyaasManifest {
  version: string;
  components: Record<string, ManifestComponent>;
}
