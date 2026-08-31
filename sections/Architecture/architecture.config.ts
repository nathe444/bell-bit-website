/** Registry-style IDs for architecture pipeline stages. */
export function architectureRegistryId(index: number) {
  return `ARC-${String(index + 1).padStart(2, "0")}`;
}

export const architectureBehavior = {
  scrubSmoothing: 0.55,
} as const;
