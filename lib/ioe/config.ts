/**
 * IOE feature configuration.
 *
 * Public IOE routes 404 when disabled; navigation and sitemap entries are
 * omitted too. The Blog section is never affected.
 */

export const IOE_ENABLED = process.env.IOE_ENABLED === "true";

/**
 * Client-visible flag (navbar/footer links). Keep in sync with IOE_ENABLED in
 * your deploy env (both vars set to "true"). Server routes always enforce
 * IOE_ENABLED regardless of this value.
 */
export const IOE_UI_VISIBLE = process.env.NEXT_PUBLIC_IOE_ENABLED === "true";

export const IOE_SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export const IOE_DRIVE_SOURCE =
  "https://drive.google.com/drive/folders/1TDxcL8f2q0Jn30A1x0UvVN2brfcpl6Ze";