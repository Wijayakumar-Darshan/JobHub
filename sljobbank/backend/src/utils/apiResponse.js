export function ok(data, message = 'Success') {
  return { success: true, message, data }
}

export function err(message) {
  return { success: false, message, data: null }
}
