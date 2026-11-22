// Modal nativo: o <dialog> aberto com showModal() já prende o foco, fecha com Esc
// e deixa o resto da página inerte. Aqui só se acrescenta o fechamento ao clicar no fundo.
// Quem usa abre e fecha pelo `ref` (showModal/close) e reage em `onClose`.
export default function Dialogo({ ref, children, ...props }) {
  function fecharAoClicarNoFundo(evento) {
    // O backdrop pertence ao próprio <dialog>: cliques no conteúdo têm outro alvo
    if (evento.target === evento.currentTarget) evento.currentTarget.close()
  }

  return (
    <dialog ref={ref} onClick={fecharAoClicarNoFundo} {...props}>
      {children}
    </dialog>
  )
}
