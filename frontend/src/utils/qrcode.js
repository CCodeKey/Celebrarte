import QRCode from 'qrcode'

// QR Codes gerados no navegador: o link não passa por nenhum serviço externo
const MARGEM = 4 // zona de silêncio exigida pela especificação, em módulos
const COR_MODULO = '#2a1c20'
const COR_FUNDO = '#ffffff'

// Nível Q (25% de redundância): continua legível impresso em papel, amassado ou com reflexo
export function gerarQr(url) {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: 'Q' })
  const { size, data } = modules
  let caminho = ''
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) caminho += `M${x + MARGEM} ${y + MARGEM}h1v1h-1z`
    }
  }
  return { caminho, lado: size + MARGEM * 2, modulos: modules }
}

export function svgQr(url) {
  const { caminho, lado } = gerarQr(url)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" shape-rendering="crispEdges">`
    + `<rect width="${lado}" height="${lado}" fill="${COR_FUNDO}"/>`
    + `<path d="${caminho}" fill="${COR_MODULO}"/></svg>`
}

export function nomeArquivo(prefixo, nome) {
  const slug = (nome ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return slug ? `${prefixo}-${slug}` : prefixo
}

function salvar(blob, arquivo) {
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = arquivo
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}

export function baixarSvg(url, arquivo) {
  salvar(new Blob([svgQr(url)], { type: 'image/svg+xml' }), `${arquivo}.svg`)
}

// Reduz a fonte até o texto caber na largura (nomes longos)
function textoAjustado(ctx, texto, peso, tamanho, familia, larguraMax) {
  let t = tamanho
  do {
    ctx.font = `${peso} ${t}px ${familia}`
    if (ctx.measureText(texto).width <= larguraMax) break
    t -= 2
  } while (t > 20)
  return t
}

// PNG em formato de cartão (1200 × 1500): título, QR grande e instrução, pronto para imprimir
export async function baixarPng(url, { titulo, subtitulo, cor, arquivo }) {
  const familia = '"Josefin Sans", system-ui, sans-serif'
  try {
    await Promise.all([document.fonts.load(`700 64px ${familia}`), document.fonts.load(`400 40px ${familia}`)])
  } catch {
    // Sem a fonte da marca, usa a do sistema
  }

  const L = 1200
  const A = 1500
  const canvas = document.createElement('canvas')
  canvas.width = L
  canvas.height = A
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = COR_FUNDO
  ctx.fillRect(0, 0, L, A)
  // Faixa de cor que identifica a finalidade do código
  ctx.fillStyle = cor
  ctx.fillRect(0, 0, L, 24)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = COR_MODULO
  const larguraTexto = L - 160
  const tTitulo = textoAjustado(ctx, titulo, 700, 68, familia, larguraTexto)
  ctx.fillText(titulo, L / 2, 170)
  if (subtitulo) {
    ctx.fillStyle = '#6e5a60'
    textoAjustado(ctx, subtitulo, 400, 44, familia, larguraTexto)
    ctx.fillText(subtitulo, L / 2, 170 + tTitulo * 0.6 + 50)
  }

  const { modulos } = gerarQr(url)
  const ladoQr = 900
  const passo = Math.floor(ladoQr / (modulos.size + MARGEM * 2))
  const ladoReal = passo * (modulos.size + MARGEM * 2)
  const x0 = Math.round((L - ladoReal) / 2)
  const y0 = 330
  ctx.fillStyle = COR_MODULO
  for (let y = 0; y < modulos.size; y++) {
    for (let x = 0; x < modulos.size; x++) {
      if (modulos.data[y * modulos.size + x]) {
        ctx.fillRect(x0 + (x + MARGEM) * passo, y0 + (y + MARGEM) * passo, passo, passo)
      }
    }
  }

  ctx.fillStyle = COR_MODULO
  ctx.font = `400 40px ${familia}`
  ctx.fillText('Aponte a câmera do celular para abrir', L / 2, y0 + ladoReal + 90)
  ctx.fillStyle = cor
  ctx.font = `700 34px ${familia}`
  ctx.fillText('Celebrarte', L / 2, A - 70)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (blob) salvar(blob, `${arquivo}.png`)
}
