import hotToast from 'react-hot-toast'

const MAX_TOASTS = 3
const activeToastIds = []
let nextToastId = 0

function push(kind, message, options = {}) {
  const id = `app-toast-${Date.now()}-${nextToastId++}`

  while (activeToastIds.length >= MAX_TOASTS) {
    hotToast.remove(activeToastIds.shift())
  }

  activeToastIds.push(id)
  return hotToast[kind](message, { ...options, id })
}

const toast = {
  success: (message, options) => push('success', message, options),
  error: (message, options) => push('error', message, options),
}

export default toast
