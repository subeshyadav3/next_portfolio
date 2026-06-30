import slugify from "slugify";

export function slugifyText(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

export function categorySlug(category: string): string {
  return slugifyText(category);
}

export function tagSlug(tag: string): string {
  return slugifyText(tag);
}
