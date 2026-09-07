export type NetworkProfile = "fast" | "slow" | "unknown";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

/** Best-effort read of save-data / effective connection type. */
export function readNetworkProfile(): NetworkProfile {
  if (typeof navigator === "undefined") return "unknown";

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return "unknown";

  if (connection.saveData) return "slow";

  const effectiveType = connection.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
    return "slow";
  }

  return "fast";
}

export function subscribeNetworkProfile(callback: () => void) {
  if (typeof navigator === "undefined") return () => {};

  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection?.addEventListener) return () => {};

  connection.addEventListener("change", callback);
  return () => connection.removeEventListener?.("change", callback);
}
