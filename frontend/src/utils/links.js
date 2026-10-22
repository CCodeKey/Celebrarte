// Monta as URLs públicas que o organizador compartilha
export const linkContribuicao = (token) => `${window.location.origin}/c/${token}`

export const linkMural = (token) => `${window.location.origin}/m/${token}`

export function urlValida(valor) {
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
