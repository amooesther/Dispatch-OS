export function cn(...inputs: (string | boolean | null | undefined)[]): string {
  return inputs.filter((v) => typeof v === "string" && v.length > 0).join(" ");
}
