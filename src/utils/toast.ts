type ToastTone = 'success' | 'error' | 'info'

function ensureHost(): HTMLElement {
  let host = document.getElementById('app-toast-host')
  if (!host) {
    host = document.createElement('div')
    host.id = 'app-toast-host'
    host.className = 'toast-host'
    document.body.appendChild(host)
  }
  return host
}

export function toast(message: string, tone: ToastTone = 'info'): void {
  const host = ensureHost()
  const el = document.createElement('div')
  el.className = `toast toast--${tone}`
  el.textContent = message
  host.appendChild(el)
  window.setTimeout(() => {
    el.classList.add('toast--leave')
    window.setTimeout(() => el.remove(), 220)
  }, 2200)
}
