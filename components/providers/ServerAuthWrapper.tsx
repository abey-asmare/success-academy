import { auth } from "@clerk/nextjs/server";
import { AuthProvider } from "./AuthProvider";

export async function ServerAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth(); 

  return (
    <AuthProvider value={{ userId: userId ?? null }}>
      {children}
    </AuthProvider>
  );
}
