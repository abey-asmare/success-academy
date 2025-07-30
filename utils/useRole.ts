import { useAuth } from "@clerk/nextjs"

export default function useRole() {
    const { sessionClaims } = useAuth()
    return sessionClaims?.metadata.role
}