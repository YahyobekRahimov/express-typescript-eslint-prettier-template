export const checkMissingFields = (
  requiredFields: string[],
  body: Record<string, unknown>,
): string[] => {
  if (!requiredFields?.length) return [];
  if (!body || typeof body !== "object") return requiredFields;

  const missingFields = requiredFields?.filter((field) => !body?.[field]);

  return missingFields;
};
