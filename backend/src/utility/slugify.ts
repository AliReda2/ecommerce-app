// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // replace spaces & symbols with hyphen
    .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}
