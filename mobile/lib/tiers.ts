const LEVELS: Record<string, number> = { STARTER: 0, PRO: 1, ELITE: 2 };

export function hasTierAccess(userTier: string, required: string): boolean {
  const userLevel = LEVELS[userTier] ?? 0;
  const requiredLevel = LEVELS[required] ?? 0;
  return userLevel >= requiredLevel;
}
