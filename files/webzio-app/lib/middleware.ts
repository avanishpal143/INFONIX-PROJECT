import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function requireSuperAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1] || req.cookies.get('token')?.value

  if (!token) {
    return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) }
  }

  const user = verifyToken(token) as any
  if (!user) {
    return { error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }) }
  }

  if (user.role !== 'superadmin' && user.role !== 'admin') {
    return { error: NextResponse.json({ success: false, message: 'Forbidden: Admin access required' }, { status: 403 }) }
  }

  return { user }
}

export function requireAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1] || req.cookies.get('token')?.value

  if (!token) {
    return { error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) }
  }

  const user = verifyToken(token) as any
  if (!user) {
    return { error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 }) }
  }

  return { user }
}
