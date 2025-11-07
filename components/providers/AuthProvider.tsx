'use client'
import React, { useContext } from "react";

export type AuthContextType = {
  userId: string | null;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({
  value,
  children,
}: {
  value: AuthContextType;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
