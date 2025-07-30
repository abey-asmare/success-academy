import { Roles } from '@/types/globals'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}
export const isAdmin = async () => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === 'admin'
}

export const checkRoleForUser = async (userId: string, role: Roles) => {
  const client = await clerkClient()

  const users = await client.users.getUserList({
    limit: 1,
    orderBy: '-created_at',
    userId: [userId]
  })

  return users.data.find((user) => user.id === userId)?.publicMetadata.role === role
}