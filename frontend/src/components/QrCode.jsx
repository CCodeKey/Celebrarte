import { useMemo, useRef, useState } from 'react'
import { baixarPng, baixarSvg, gerarQr } from '../utils/qrcode'

function IconeAmpliar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}

function IconeBaixar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ImagemQr({ caminho, lado, rotulo, className }) {
  return (
    <svg className={className} viewBox={`0 0 ${lado} ${lado}`} shapeRendering="crispEdges" role="img" aria-label={rotulo}>
      <rect width={lado} height={lado} fill="#fff" />
      <path d={caminho} fill="#2a1c20" />
    </svg>
  )
}

// Prévia clicável do QR Code; amplia num diálogo com opções de download.
// titulo/subtitulo/cor vão impressos no PNG, para quem recebe saber para que serve o código
export default function QrCode({ url, rotulo, titulo, subtitulo, cor, arquivo }) {
  const qr = useMemo(() => gerarQr(url), [url])
  const dialogo = useRef(null)
  const [baixando, setBaixando] = useState(false)

  async function png() {
    setBaixando(true)
    try {
      await baixarPng(url, { titulo, subtitulo, cor, arquivo })
    } finally {
      setBaixando(false)
    }
  }

  const botoesDownload = (
    <>
      <button type="button" className="botao botao-secundario" onClick={png} disabled={baixando}>
        <IconeBaixar /> {baixando ? 'Gerando…' : 'Baixar PNG'}
      </button>
      <button type="button" className="botao botao-fantasma" onClick={() => baixarSvg(url, arquivo)}
        title="Vetorial: ideal para gráficas e impressões grandes">
        Baixar SVG
      </button>
    </>
  )

  return (
    <div className="qr">
      <button type="button" className="qr-previa" onClick={() => dialogo.current?.showModal()}
        aria-label={`Ampliar QR Code: ${rotulo}`} title="Ampliar">
        <ImagemQr {...qr} rotulo={`QR Code: ${rotulo}`} />
        <span className="qr-previa-lupa" aria-hidden="true"><IconeAmpliar /></span>
      </button>
      <button type="button" className="botao-link qr-baixar-rapido" onClick={png} disabled={baixando}>
        <IconeBaixar /> {baixando ? 'Gerando…' : 'Baixar QR Code'}
      </button>

      <dialog ref={dialogo} className="qr-dialogo" aria-labelledby={`${arquivo}-titulo`}
        onClick={(e) => { if (e.target === dialogo.current) dialogo.current.close() }}>
        <div className="qr-dialogo-conteudo" style={{ '--qr-cor': cor }}>
          <button type="button" className="qr-dialogo-fechar" onClick={() => dialogo.current?.close()} aria-label="Fechar">×</button>
          <p className="qr-dialogo-etiqueta">{rotulo}</p>
          <h2 id={`${arquivo}-titulo`}>{titulo}</h2>
          {subtitulo && <p className="texto-suave">{subtitulo}</p>}
          <ImagemQr {...qr} rotulo={`QR Code: ${rotulo}`} className="qr-dialogo-imagem" />
          <p className="qr-dialogo-url">{url}</p>
          <div className="acoes acoes-centro">{botoesDownload}</div>
        </div>
      </dialog>
    </div>
  )
}
