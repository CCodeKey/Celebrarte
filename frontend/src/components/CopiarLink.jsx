import { useState } from 'react'

export default function CopiarLink({ titulo, descricao, url }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Sem permissão de área de transferência: o link continua visível para copiar à mão
    }
  }

  return (
    <div className="copiar-link">
      <div>
        <h3>{titulo}</h3>
        <p className="texto-suave">{descricao}</p>
      </div>
      <div className="copiar-link-linha">
        <input type="text" value={url} readOnly aria-label={titulo} onFocus={(e) => e.target.select()} />
        <button type="button" className="botao botao-secundario" onClick={copiar}>
          {copiado ? 'Copiado!' : 'Copiar'}
        </button>
        <a className="botao botao-fantasma" href={url} target="_blank" rel="noreferrer">
          Abrir
        </a>
      </div>
    </div>
  )
}
