import type { PlatformSelection } from '../../types/users.types.js';

export function normalizePlatformSelections(
  platforms: PlatformSelection[] | undefined,
): { name: string; imageUrl: string | null }[] {
  return (platforms ?? [])
    .map((p) => ({ name: p.name.trim(), imageUrl: p.imageUrl ?? null }))
    .filter((p) => !!p.name);
}
