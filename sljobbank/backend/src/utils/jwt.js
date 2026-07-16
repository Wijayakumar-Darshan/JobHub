import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

export function generateAccessToken(email, role) {
  return jwt.sign({ sub: email, role, type: 'access' }, SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h',
  })
}

export function generateRefreshToken(email) {
  return jwt.sign({ sub: email, type: 'refresh' }, SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET) // throws if invalid/expired
}
