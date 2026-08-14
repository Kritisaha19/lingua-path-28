/** Normalize a learner answer for forgiving comparison. */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:¡¿"'()]/g, "")
    .replace(/\s+/g, " ");
}

export function answersMatch(given: string, expected: string | null): boolean {
  if (!expected) return false;
  return normalizeAnswer(given) === normalizeAnswer(expected);
}

export function getTranslation(
  extraData: Record<string, unknown> | null,
): string | null {
  const value = extraData?.['translation'];
  return typeof value === "string" ? value : null;
}

export function formatJoinedDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}