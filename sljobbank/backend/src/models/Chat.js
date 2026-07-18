/**
 * chat.js
 * Complete frontend chat client – API + UI management.
 * Assumes your backend router is mounted at /api/chat
 * and authentication is cookie‑based.
 */

const API_BASE = '/api/chat';

// ===================== API CLIENT =====================

async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json.data;
}

export async function getMessages(limit = 50) {
  return apiCall(`/messages?limit=${limit}`);
}

export async function sendMessage(content) {
  return apiCall('/messages', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function editMessage(messageId, content) {
  return apiCall(`/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
}

export async function deleteMessage(messageId) {
  return apiCall(`/messages/${messageId}`, {
    method: 'DELETE',
  });
}

// ===================== UI MANAGEMENT =====================

/**
 * Renders a single message element.
 * @param {Object} msg – message DTO
 * @param {string} currentUserId – current user's ID (for edit permissions)
 * @param {string} currentUserRole – role (STUDENT, COUNSELOR, SUPER_ADMIN)
 * @returns {HTMLElement}
 */
function createMessageElement(msg, currentUserId, currentUserRole) {
  const div = document.createElement('div');
  div.className = 'chat-message';
  div.dataset.id = msg.id;

  const isOwn = msg.authorId === currentUserId;
  const canEdit = isOwn && currentUserRole === 'STUDENT' && !msg.edited; // student can edit only their own
  const canDelete = currentUserRole === 'COUNSELOR' || currentUserRole === 'SUPER_ADMIN';

  div.innerHTML = `
    <div class="message-header">
      <strong>${escapeHtml(msg.authorName)}</strong>
      <span class="role-badge">${msg.authorRole}</span>
      <span class="timestamp">${new Date(msg.createdAt).toLocaleString()}</span>
      ${msg.edited ? '<span class="edited-badge">(edited)</span>' : ''}
    </div>
    <div class="message-body">${escapeHtml(msg.content)}</div>
    <div class="message-actions">
      ${canEdit ? `<button class="edit-btn" data-id="${msg.id}">Edit</button>` : ''}
      ${canDelete ? `<button class="delete-btn" data-id="${msg.id}">Delete</button>` : ''}
    </div>
  `;

  // Attach event listeners
  const editBtn = div.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => startEdit(msg.id, msg.content));
  }

  const deleteBtn = div.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => handleDelete(msg.id));
  }

  return div;
}

/**
 * Simple HTML escaping to prevent XSS.
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===================== GLOBAL STATE =====================

let messages = [];
let currentUserId = null;
let currentUserRole = null;
let editingMessageId = null; // used to cancel edit

// DOM references
const container = document.getElementById('chat-messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const errorDiv = document.getElementById('chat-error');

// ===================== RENDER =====================

function renderMessages() {
  if (!container) return;
  // Clear and re-render all messages
  container.innerHTML = '';
  // Reverse to show newest at bottom (assuming API returns newest first)
  const sorted = [...messages].reverse();
  sorted.forEach(msg => {
    const el = createMessageElement(msg, currentUserId, currentUserRole);
    container.appendChild(el);
  });
  scrollToBottom();
}

function scrollToBottom() {
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

// ===================== ACTIONS =====================

export async function loadMessages() {
  try {
    messages = await getMessages(100);
    renderMessages();
  } catch (err) {
    showError('Failed to load messages: ' + err.message);
  }
}

export async function handleSend(e) {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;
  try {
    const newMsg = await sendMessage(content);
    messages.push(newMsg);
    renderMessages();
    input.value = '';
    hideError();
  } catch (err) {
    showError('Send failed: ' + err.message);
  }
}

export function startEdit(messageId, currentContent) {
  // Cancel any existing edit
  if (editingMessageId) {
    cancelEdit();
  }
  editingMessageId = messageId;
  input.value = currentContent;
  input.focus();
  // Change button text
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Update';
  // Add a cancel button if not exists
  let cancelBtn = form.querySelector('.cancel-edit');
  if (!cancelBtn) {
    cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'cancel-edit';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', cancelEdit);
    form.appendChild(cancelBtn);
  }
  cancelBtn.style.display = 'inline-block';
}

export function cancelEdit() {
  editingMessageId = null;
  input.value = '';
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = 'Send';
  const cancelBtn = form.querySelector('.cancel-edit');
  if (cancelBtn) cancelBtn.style.display = 'none';
  hideError();
}

export async function handleSubmit(e) {
  e.preventDefault();
  if (editingMessageId) {
    // We are in edit mode
    const content = input.value.trim();
    if (!content) {
      showError('Message cannot be empty.');
      return;
    }
    try {
      const updated = await editMessage(editingMessageId, content);
      const idx = messages.findIndex(m => m.id === updated.id);
      if (idx !== -1) messages[idx] = updated;
      renderMessages();
      cancelEdit();
      hideError();
    } catch (err) {
      showError('Edit failed: ' + err.message);
    }
  } else {
    // Normal send
    await handleSend(e);
  }
}

export async function handleDelete(messageId) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  try {
    await deleteMessage(messageId);
    messages = messages.filter(m => m.id !== messageId);
    renderMessages();
    hideError();
  } catch (err) {
    showError('Delete failed: ' + err.message);
  }
}

// ===================== ERROR / INFO =====================

function showError(msg) {
  if (errorDiv) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }
}

function hideError() {
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }
}

// ===================== INIT =====================

/**
 * Initialize the chat with current user info.
 * @param {string} userId – current user's ID
 * @param {string} userRole – 'STUDENT', 'COUNSELOR', 'SUPER_ADMIN'
 */
export function initChat(userId, userRole) {
  currentUserId = userId;
  currentUserRole = userRole;

  // Set up event listeners
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // Load messages
  loadMessages();

  // Optional: auto‑refresh every 30 seconds
  // setInterval(loadMessages, 30000);
}

// If you're using ES modules, export everything.
// For plain script tags, you can attach to window.