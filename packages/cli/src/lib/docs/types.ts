/** A documentation URL from one resolved registry item. */
export interface RegistryDoc {
  name: string;
  url: string;
}

export interface DocsPlan {
  entries: RegistryDoc[];
}
