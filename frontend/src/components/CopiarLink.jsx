import { useEffect, useRef, useState } from 'react'

const DURACAO_CONFIRMACAO = 2000

export default function CopiarLink({ titulo, descricao, url }) {
  const [copiado, setCopiado] = useState(false)
  const timer = useRef(null)

  // Não deixa o timer da confirmação rodando depois que o componente sai da tela
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopiado(false), DURACAO_CONFIRMACAO)
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
      {/* A troca do texto do botão não é anunciada por leitores de tela */}
      <span className="visualmente-oculto" role="status">{copiado ? 'Link copiado.' : ''}</span>
    </div>
  )
}
