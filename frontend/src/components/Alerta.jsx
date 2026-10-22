// tipo: "erro" | "sucesso" | "info"
export default function Alerta({ tipo = 'info', children }) {
  if (!children) return null
  return (
    <div className={`alerta alerta-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
