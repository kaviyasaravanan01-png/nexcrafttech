"use client";

import { useState, useEffect } from "react";
import { useWACRMAuth } from "./useAuth";
import { fetchWAConnectionStatus, isWAReady } from "./waConnection";

/**
 * Shared hook for WhatsApp link status across CRM pages.
 * @param {{ pollMs?: number }} options - optional polling interval (e.g. 30000 for sidebar)
 */
export function useWAConnectionStatus({ pollMs = 0 } = {}) {
  const { user, session } = useWACRMAuth();
  const [status, setStatus] = useState(null);
  const [ready, setReady] = useState(null);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setReady(null);
      return;
    }

    let cancelled = false;

    async function load() {
      const next = await fetchWAConnectionStatus(user.id, session?.access_token);
      if (cancelled) return;
      setStatus(next);
      setReady(isWAReady(next));
    }

    load();
    if (!pollMs) return () => { cancelled = true; };

    const iv = setInterval(load, pollMs);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, [user?.id, session?.access_token, pollMs]);

  return {
    status,
    ready,
    loading: user && ready === null,
  };
}
