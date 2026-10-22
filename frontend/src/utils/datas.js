// O backend usa LocalDateTime ("2026-11-05T00:00:00"), sem fuso: interpretado como horário local

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
const formatoDataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export const formatarData = (valor) => (valor ? formatoData.format(new Date(valor)) : '')

export const formatarDataHora = (valor) => (valor ? formatoDataHora.format(new Date(valor)) : '')

// "2026-11-05T00:00:00" -> "2026-11-05", para <input type="date">
export const paraInputData = (valor) => (valor ? valor.slice(0, 10) : '')

// "2026-11-05" -> "2026-11-05T00:00:00", formato aceito pelo backend
export const deInputData = (valor) => (valor ? `${valor}T00:00:00` : null)

// RN-33: o envio encerra dois dias após a data do aniversário
export function envioEncerrado(dataCelebracao) {
  const encerramento = new Date(dataCelebracao)
  encerramento.setDate(encerramento.getDate() + 2)
  return new Date() > encerramento
}
