import { verifyToken } from '../utils/jwt.js'
import { err } from '../utils/apiResponse.js'
import { User } from '../models/index.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json(err('Missing or invalid Authorization header.'))

    const payload = verifyToken(token)
    if (payload.type !== 'access') return res.status(401).json(err('Invalid token type.'))

    const user = await User.findOne({ where: { email: payload.sub } })
    if (!user || !user.isActive) return res.status(401).json(err('Account not found or suspended.'))

    req.user = user
    next()
  } catch (e) {
    return res.status(401).json(err('Invalid or expired token.'))
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(err('You do not have permission to perform this action.'))
    }
    next()
  }
}
