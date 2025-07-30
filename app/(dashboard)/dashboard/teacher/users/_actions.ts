'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(id: string ) {
  const client = await clerkClient()

  // Check that the user trying to set the role is an admin
  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    const res = await client.users.updateUserMetadata(id as string, {
      publicMetadata: { role: 'admin' },
    })
    return { message: res.publicMetadata,status: 200 }
  } catch (err) {
    return { message: err, status: 500 }
  }
}

export async function removeRole(id: string) {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(id as string, {
      publicMetadata: { role: null },
    })
    return { message: res.publicMetadata, status: 200 }
  } catch (err) {
    return { message: err, status: 500 }
  }
}