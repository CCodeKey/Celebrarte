// Ícones de traço usados em botões. São sempre decorativos (aria-hidden):
// o nome acessível fica no texto ou no aria-label do botão que os contém.
function Icone({ tamanho = 20, children }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

export function IconeOlho({ riscado = false }) {
  return (
    <Icone>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {riscado && <line x1="3" y1="3" x2="21" y2="21" />}
    </Icone>
  )
}

export function IconeAmpliar() {
  return (
    <Icone tamanho={16}>
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </Icone>
  )
}

export function IconeBaixar() {
  return (
    <Icone tamanho={16}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </Icone>
  )
}

// Porta com seta saindo: ícone convencional de "sair da conta"
export function IconeSair() {
  return (
    <Icone tamanho={18}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Icone>
  )
}
