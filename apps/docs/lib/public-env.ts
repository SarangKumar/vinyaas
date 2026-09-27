/**
 * Public site links. Values come from NEXT_PUBLIC_* variables so the
 * docs app can change them without editing components.
 */
export function portfolioUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}
