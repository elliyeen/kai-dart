"use client";
// ─── KAI DART — Station Engine React Hook ─────────────────────────────────────
// Drives the real-time simulation loop. Ticks every 3s.

import { useState, useEffect, useCallback, useRef } from "react";
import { initStations, tickNetwork } from "./simulation";
import type { StationWorldModel } from "./types";

export function useStationEngine(tickIntervalMs = 3000) {
  const [stations, setStations] = useState<StationWorldModel[]>(() => initStations());
  const [isLive, setIsLive] = useState(true);
  const [tickCount, setTickCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick loop
  useEffect(() => {
    if (!isLive) return;
    intervalRef.current = setInterval(() => {
      setStations(prev => tickNetwork(prev));
      setTickCount(c => c + 1);
    }, tickIntervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, tickIntervalMs]);

  const pause = useCallback(() => setIsLive(false), []);
  const resume = useCallback(() => setIsLive(true), []);
  const toggle = useCallback(() => setIsLive(v => !v), []);

  const getStation = useCallback(
    (id: string) => stations.find(s => s.id === id),
    [stations]
  );

  return { stations, isLive, tickCount, pause, resume, toggle, getStation };
}
