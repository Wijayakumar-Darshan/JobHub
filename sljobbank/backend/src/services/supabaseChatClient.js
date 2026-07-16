import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY


function headers() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}


function configured() {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SERVICE_KEY) &&
    !SUPABASE_URL.includes('your-project')
  )
}


// Create new chat message
export async function insert(
  authorId,
  authorName,
  authorRole,
  content
) {

  if (!configured()) {

    const error = new Error(
      'Chat is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY.'
    )

    error.status = 503

    throw error
  }


  try {

    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/chat_messages`,
      {
        author_id: authorId,
        author_name: authorName,
        author_role: authorRole,
        content: content,
        is_deleted: false
      },
      {
        headers: headers()
      }
    )


    return response.data[0]


  } catch (error) {

    console.error('========== SUPABASE INSERT ERROR ==========')
    console.error('Status:', error.response?.status)
    console.error(
      'Response:',
      error.response?.data || error.message
    )
    console.error('============================================')

    throw error
  }
}



// Find message by ID
export async function findById(id) {

  try {

    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/chat_messages?id=eq.${id}`,
      {
        headers: headers()
      }
    )


    return response.data[0]


  } catch (error) {

    console.error(
      'Find message error:',
      error.response?.data || error.message
    )

    throw error
  }
}



// Update message content
export async function updateContent(
  id,
  content
) {

  try {

    const response = await axios.patch(
      `${SUPABASE_URL}/rest/v1/chat_messages?id=eq.${id}`,
      {
        content: content,
        edited_at: new Date().toISOString()
      },
      {
        headers: headers()
      }
    )


    return response.data[0]


  } catch (error) {

    console.error(
      'Update message error:',
      error.response?.data || error.message
    )

    throw error
  }
}



// Soft delete message
export async function softDelete(
  id,
  deletedByUserId
) {

  try {

    const response = await axios.patch(
      `${SUPABASE_URL}/rest/v1/chat_messages?id=eq.${id}`,
      {
        is_deleted: true,
        deleted_by: deletedByUserId,
        deleted_at: new Date().toISOString()
      },
      {
        headers: headers()
      }
    )


    return response.data[0]


  } catch (error) {

    console.error(
      'Delete message error:',
      error.response?.data || error.message
    )

    throw error
  }
}



// Get recent messages
export async function recent(limit = 50) {

  if (!configured()) {
    return []
  }


  try {

    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/chat_messages?is_deleted=eq.false&order=created_at.desc&limit=${limit}`,
      {
        headers: headers()
      }
    )


    return response.data


  } catch (error) {

    console.error(
      'Get messages error:',
      error.response?.data || error.message
    )

    throw error
  }
}



// Check Supabase configuration
export {
  configured as isChatConfigured
}