"use client";

import { useSyncExternalStore } from "react";
import { readNetworkProfile, subscribeNetworkProfile, type NetworkProfile } from "@/lib/networkProfile";

/** Reactive network profile for throttling heavy asset loads on slow links. */
export function useNetworkProfile(): NetworkProfile {
  return useSyncExternalStore(subscribeNetworkProfile, readNetworkProfile, () => "unknown");
}
