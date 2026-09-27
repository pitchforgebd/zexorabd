// Derives a URL slug from a sister concern's name on the fly rather than
// storing one - home.sisterConcerns is a plain settings array (no database
// row/id to key off), and re-deriving from the current name keeps the admin
// form simple (no separate "slug" field to keep in sync if the name changes).
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
