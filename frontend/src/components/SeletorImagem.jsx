import { useEffect, useId, useRef, useState } from 'react'
import { urlValida } from '../utils/links'

// Mesmas regras do backend (RNF-05 a RNF-07); lá o tipo é conferido pelo conteúdo do arquivo
const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
const LIMITE_BYTES = 5 * 1024 * 1024

// valor: { modo: 'arquivo' | 'link', arquivo: File | null, url: string }
export default function SeletorImagem({ valor, onChange, erro, onErro }) {
  const id = useId()
  const inputArquivo = useRef(null)
  const [arrastando, setArrastando] = useState(false)
  const [previewArquivo, setPreviewArquivo] = useState(null)
  const [linkQuebrado, setLinkQuebrado] = useState(false)

  // URL temporária para pré-visualizar o arquivo escolhido, liberada ao trocar
  useEffect(() => {
    if (!valor.arquivo) {
      setPreviewArquivo(null)
      return
    }
    const url = URL.createObjectURL(valor.arquivo)
    setPreviewArquivo(url)
    return () => URL.revokeObjectURL(url)
  }, [valor.arquivo])

  function trocarModo(modo) {
    onErro(null)
    onChange({ ...valor, modo })
  }

  function escolherArquivo(arquivo) {
    if (!arquivo) return
    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      onErro('Formato não aceito. Use uma imagem JPEG, PNG ou WEBP.')
      return
    }
    if (arquivo.size > LIMITE_BYTES) {
      onErro('A imagem deve ter no máximo 5 MB.')
      return
    }
    onErro(null)
    onChange({ ...valor, arquivo })
  }

  function removerArquivo() {
    onChange({ ...valor, arquivo: null })
    // Permite escolher o mesmo arquivo de novo
    if (inputArquivo.current) inputArquivo.current.value = ''
  }

  function soltar(e) {
    e.preventDefault()
    setArrastando(false)
    escolherArquivo(e.dataTransfer.files[0])
  }

  const url = valor.url.trim()
  const mostrarPreviewLink = valor.modo === 'link' && urlValida(url) && !linkQuebrado

  return (
    <fieldset className="seletor-imagem" aria-describedby={erro ? `${id}-erro` : undefined}>
      <legend>Imagem (opcional)</legend>

      <div className="seletor-modos" role="radiogroup" aria-label="Como adicionar a imagem">
        {[
          ['arquivo', 'Enviar do dispositivo'],
          ['link', 'Colar um link'],
        ].map(([modo, texto]) => (
          <label key={modo} className={valor.modo === modo ? 'ativo' : undefined}>
            <input type="radio" name={`${id}-modo`} value={modo} checked={valor.modo === modo}
              onChange={() => trocarModo(modo)} />
            {texto}
          </label>
        ))}
      </div>

      {valor.modo === 'arquivo' && (
        valor.arquivo ? (
          <div className="seletor-preview">
            {previewArquivo && <img src={previewArquivo} alt="Pré-visualização da imagem escolhida" />}
            <div className="seletor-preview-info">
              <span className="seletor-nome-arquivo">{valor.arquivo.name}</span>
              <div className="acoes">
                <button type="button" className="botao botao-fantasma" onClick={() => inputArquivo.current?.click()}>
                  Trocar
                </button>
                <button type="button" className="botao-link botao-perigo" onClick={removerArquivo}>Remover</button>
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor={`${id}-arquivo`}
            className={`seletor-area${arrastando ? ' arrastando' : ''}${erro ? ' invalido' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setArrastando(true)
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={soltar}
          >
            <span className="seletor-icone" aria-hidden="true">＋</span>
            <span className="seletor-titulo">Escolha uma foto ou arraste até aqui</span>
            <span className="texto-suave">JPEG, PNG ou WEBP, até 5 MB</span>
          </label>
        )
      )}
      {/* Fica fora do condicional para o botão "Trocar" continuar funcionando */}
      {valor.modo === 'arquivo' && (
        <input
          ref={inputArquivo}
          id={`${id}-arquivo`}
          type="file"
          accept={TIPOS_ACEITOS.join(',')}
          className="visualmente-oculto"
          onChange={(e) => escolherArquivo(e.target.files[0])}
        />
      )}

      {valor.modo === 'link' && (
        <div className="campo">
          <label htmlFor={`${id}-link`}>Link da imagem</label>
          <input
            id={`${id}-link`}
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={valor.url}
            aria-invalid={!!erro}
            onChange={(e) => {
              setLinkQuebrado(false)
              onErro(null)
              onChange({ ...valor, url: e.target.value })
            }}
          />
          <span className="campo-dica">Cole o endereço de uma foto já publicada na internet.</span>
          {mostrarPreviewLink && (
            <img className="preview-imagem" src={url} alt="Pré-visualização da imagem do link"
              onError={() => setLinkQuebrado(true)} />
          )}
          {linkQuebrado && <span className="campo-dica">Não conseguimos carregar esta imagem. Confira o link.</span>}
        </div>
      )}

      {erro && <span id={`${id}-erro`} className="campo-erro">{erro}</span>}
    </fieldset>
  )
}
