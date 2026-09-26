/** A custom property to merge into the light or dark scope. */
export interface CssVariable {
  scope: "light" | "dark";
  name: string;
  value: string;
}

/**
 * Additional CSS from the registry `css` map.
 * `selector` is the object key. `body` is the declaration string.
 */
export interface CssRule {
  selector: string;
  body: string;
}

export interface CssUpdate {
  relativePath: string;
  previous: string;
  next: string;
  changed: boolean;
}
