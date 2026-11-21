// Monta as URLs públicas que o organizador compartilha
export const linkContribuicao = (token) => `${window.location.origin}/c/${token}`

export const linkMural = (token) => `${window.location.origin}/m/${token}`

// O token do mural só chega depois de um envio válido. Guardamos no navegador do convidado,
// associado ao link de contribuição, para oferecer o atalho "Ver mural" quando ele voltar ao formulário.
const chaveMural = (tokenContribuicao) => `celebrarte:mural:${tokenContribuicao}`

export function lembrarTokenMural(tokenContribuicao, tokenMural) {
  try {
    localStorage.setItem(chaveMural(tokenContribuicao), tokenMural)
  } catch {
    // Armazenamento indisponível (aba anônima, bloqueado): o atalho só não aparece
  }
}

export function tokenMuralLembrado(tokenContribuicao) {
  try {
    return localStorage.getItem(chaveMural(tokenContribuicao))
  } catch {
    return null
  }
}

export function urlValida(valor) {
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
