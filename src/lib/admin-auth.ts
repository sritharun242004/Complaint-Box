'use server'

import { cookies } from 'next/headers'
import { createHash } from 'crypto'

function getSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET environment variable is required')
  return createHash('sha256').update(`admin-session-${secret}`).digest('hex')
}

export async function adminLogin(username: string, password: string) {
  const validUsername = process.env.ADMIN_USERNAME
  const validPassword = process.env.ADMIN_PASSWORD

  if (!validUsername || !validPassword) {
    return { error: 'Admin credentials not configured' }
  }

  if (username !== validUsername || password !== validPassword) {
    return { error: 'Invalid credentials' }
  }

  const token = getSessionToken()
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return { success: true }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  return { success: true }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session) return false
  return session.value === getSessionToken()
}
