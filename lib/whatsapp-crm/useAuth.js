"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { getSupabase } from "./supabase";

const AuthContext = createContext(null);

export function WACRMAuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setUser(null); return; }

    // Get initial session
    sb.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useWACRMAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useWACRMAuth must be inside WACRMAuthProvider");
  return ctx;
}
