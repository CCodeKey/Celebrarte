import { useId, useMemo, useRef, useState } from 'react'
import { baixarPng, baixarSvg, gerarQr } from '../utils/qrcode'
import Dialogo from './Dialogo'
import { IconeAmpliar, IconeBaixar } from './Icones'

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
  const idTitulo = useId()
  const dialogo = useRef(null)
  // Montar o QR percorre todos os módulos: só refaz quando o link muda
  const { caminho, lado } = useMemo(() => gerarQr(url), [url])
  const [gerandoPng, setGerandoPng] = useState(false)
  const rotuloImagem = `QR Code: ${rotulo}`

  async function baixarComoPng() {
    setGerandoPng(true)
    try {
      await baixarPng(url, { titulo, subtitulo, cor, arquivo })
    } finally {
      setGerandoPng(false)
    }
  }

  return (
    <div className="qr">
      <button type="button" className="qr-previa" onClick={() => dialogo.current?.showModal()}
        aria-label={`Ampliar QR Code: ${rotulo}`} title="Ampliar">
        <ImagemQr caminho={caminho} lado={lado} rotulo={rotuloImagem} />
        <span className="qr-previa-lupa" aria-hidden="true"><IconeAmpliar /></span>
      </button>
      <button type="button" className="botao-link qr-baixar-rapido" onClick={baixarComoPng} disabled={gerandoPng}>
        <IconeBaixar /> {gerandoPng ? 'Gerando…' : 'Baixar QR Code'}
      </button>

      <Dialogo ref={dialogo} className="qr-dialogo" aria-labelledby={idTitulo}>
        <div className="qr-dialogo-conteudo" style={{ '--qr-cor': cor }}>
          <button type="button" className="qr-dialogo-fechar" onClick={() => dialogo.current?.close()} aria-label="Fechar">×</button>
          <p className="qr-dialogo-etiqueta">{rotulo}</p>
          <h2 id={idTitulo}>{titulo}</h2>
          {subtitulo && <p className="texto-suave">{subtitulo}</p>}
          <ImagemQr caminho={caminho} lado={lado} rotulo={rotuloImagem} className="qr-dialogo-imagem" />
          <p className="qr-dialogo-url">{url}</p>
          <div className="acoes acoes-centro">
            <button type="button" className="botao botao-secundario" onClick={baixarComoPng} disabled={gerandoPng}>
              <IconeBaixar /> {gerandoPng ? 'Gerando…' : 'Baixar PNG'}
            </button>
            <button type="button" className="botao botao-fantasma" onClick={() => baixarSvg(url, arquivo)}
              title="Vetorial: ideal para gráficas e impressões grandes">
              Baixar SVG
            </button>
          </div>
        </div>
      </Dialogo>
    </div>
  )
}
