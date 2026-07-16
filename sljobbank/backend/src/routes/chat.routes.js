import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { ok, err } from '../utils/apiResponse.js'
import * as chat from '../services/supabaseChatClient.js'

const router = Router()
router.use(requireAuth)

function toDto(row) {
  if (!row) return null
  return {
    id: row.id, authorId: row.author_id, authorName: row.author_name, authorRole: row.author_role,
    content: row.content, edited: !!row.edited_at, createdAt: row.created_at,
  }
}

router.get('/messages', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const rows = await chat.recent(limit)
  return res.json(ok(rows.map(toDto)))
})

router.post('/messages', async (req, res) => {
  const content = (req.body.content || '').trim()
  if (!content) return res.status(400).json(err('Message can\'t be empty.'))
  if (content.length > 2000) return res.status(400).json(err('Message is too long (max 2000 characters).'))
  try {
    const row = await chat.insert(req.user.id, req.user.fullName, req.user.role, content)
    return res.json(ok(toDto(row)))
  } catch (e) { return res.status(e.status || 500).json(err(e.message)) }
})

// Student edits ONLY their own message. Never anyone else's.
router.put('/messages/:id', async (req, res) => {
  if (req.user.role !== 'STUDENT') {
    return res.status(403).json(err('Only the student who posted a message can edit it.'))
  }
  const existing = await chat.findById(req.params.id)
  if (!existing) return res.status(404).json(err('Message not found.'))
  if (existing.author_id !== req.user.id) return res.status(403).json(err('You can only edit your own messages.'))
  if (existing.is_deleted) return res.status(400).json(err('This message has been removed and can\'t be edited.'))

  const content = (req.body.content || '').trim()
  if (!content) return res.status(400).json(err('Message can\'t be empty.'))
  const row = await chat.updateContent(req.params.id, content)
  return res.json(ok(toDto(row)))
})

// Only counselor/admin can delete - never the student, even their own message.
router.delete('/messages/:id', async (req, res) => {
  if (req.user.role !== 'COUNSELOR' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json(err('Only a counselor or admin can delete a message.'))
  }
  const existing = await chat.findById(req.params.id)
  if (!existing) return res.status(404).json(err('Message not found.'))
  await chat.softDelete(req.params.id, req.user.id)
  return res.json(ok(null, 'Message removed'))
})

export default router
