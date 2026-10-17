# Regras de Negócio

## 1. Usuários

### RN-01 — Cadastro de usuário

Somente usuários cadastrados podem criar e administrar celebrações.

### RN-02 — Autenticação para administração

O usuário deve estar autenticado para acessar funcionalidades administrativas de suas celebrações.

### RN-03 — Propriedade da celebração

Uma celebração pertence a um único usuário responsável.

### RN-04 — Acesso às celebrações

Um usuário somente pode administrar as celebrações que lhe pertencem.

---

## 2. Celebrações

### RN-05 — Criação de celebração

Uma celebração deve possuir, no mínimo, um aniversariante e uma data.

### RN-06 — Responsável pela celebração

Toda celebração deve possuir obrigatoriamente um usuário responsável.

### RN-07 — Identificação pública da celebração

Toda celebração deve possuir identificadores públicos exclusivos para o link de contribuição e para o link do mural.

### RN-08 — Exclusividade dos links

Os identificadores utilizados nos links públicos não podem ser compartilhados por duas celebrações diferentes.

### RN-09 — Separação entre acesso público e administrativo

Os links públicos de uma celebração não podem conceder acesso às funcionalidades administrativas da mesma celebração.

---

## 3. Homenagens

### RN-10 — Associação da homenagem

Toda homenagem enviada deve estar vinculada a uma única celebração.

### RN-11 — Autor da homenagem

O convidado pode informar seu nome ao enviar uma homenagem.

### RN-12 — Homenagem sem identificação

A ausência do nome do autor não deve impedir o envio da homenagem.

### RN-13 — Conteúdo mínimo da homenagem

Uma homenagem deve possuir pelo menos uma mensagem ou uma imagem.

### RN-14 — Homenagem somente com imagem

Uma homenagem pode ser enviada contendo somente uma imagem.

### RN-15 — Homenagem somente com mensagem

Uma homenagem pode ser enviada contendo somente uma mensagem.

### RN-16 — Homenagem com imagem e mensagem

Uma homenagem pode conter simultaneamente uma imagem e uma mensagem.

### RN-17 — Imagem da homenagem

Quando uma imagem for enviada, ela deve obedecer aos formatos e limites definidos pelo sistema.

### RN-18 — Envio da homenagem

Uma homenagem somente deve ser registrada após o sistema validar os dados obrigatórios e os arquivos enviados.

### RN-19 — Independência de conta

O convidado não precisa possuir uma conta no Celebrarte para enviar uma homenagem.

---

## 4. Mural

### RN-20 — Acesso ao mural

Qualquer pessoa que possua o link válido do mural pode visualizar a celebração e suas homenagens, sem necessidade de autenticação.

### RN-21 — Conteúdo do mural

O mural deve apresentar as homenagens associadas à celebração acessada.

### RN-22 — Elementos opcionais

O mural deve apresentar somente os elementos disponíveis em cada homenagem.

### RN-23 — Homenagem sem imagem

Uma homenagem sem imagem deve continuar sendo exibida no mural.

### RN-24 — Homenagem sem mensagem

Uma homenagem sem mensagem deve continuar sendo exibida no mural.

### RN-25 — Exibição do autor

Quando o nome do autor tiver sido informado, ele poderá ser apresentado junto à homenagem.

### RN-26 — Homenagem sem autor

Quando o autor não tiver informado seu nome, a homenagem deve continuar sendo exibida normalmente.

---

## 5. Links públicos

### RN-27 — Link de contribuição

O link de contribuição deve permitir acesso somente às funcionalidades necessárias para o envio de uma homenagem.

### RN-28 — Link do mural

O link do mural deve permitir acesso somente às funcionalidades necessárias para visualização da celebração e de suas homenagens.

### RN-29 — Inexistência da celebração

Um link público associado a uma celebração inexistente não deve permitir acesso a dados de outras celebrações.

### RN-30 — Isolamento entre celebrações

Uma pessoa acessando o link público de uma celebração não deve conseguir visualizar ou alterar informações de outra celebração por meio desse link.

---

## 6. Integridade das homenagens

### RN-31 — Uma homenagem pertence a uma celebração

Uma homenagem não pode existir sem estar associada a uma celebração válida.

### RN-32 — Não duplicação de associação

Uma homenagem não pode estar simultaneamente associada a duas celebrações.

### RN-33 — Registro após validação

Dados de uma homenagem que não atendam às regras de validação não devem ser registrados como uma homenagem válida.

---

## 7. Regras ainda não definidas

As seguintes regras ainda precisam ser decididas antes de considerarmos o domínio completamente fechado:

- **RN-34 — Exclusão de homenagem:** o responsável pela celebração poderá excluir uma homenagem?
- **RN-35 — Edição de celebração:** o responsável poderá alterar os dados da celebração após sua criação?
- **RN-36 — Exclusão de celebração:** o responsável poderá excluir uma celebração?
- **RN-37 — Expiração:** a celebração terá uma data de encerramento para recebimento de homenagens?
- **RN-38 — Moderação:** as homenagens aparecerão imediatamente no mural ou precisarão ser aprovadas pelo responsável?
- **RN-39 — Limite de homenagens:** haverá limite de homenagens por celebração?
- **RN-40 — Limite de imagens:** uma homenagem poderá possuir apenas uma imagem ou várias?
- **RN-41 — Conteúdo textual:** haverá limite de caracteres para a mensagem?
- **RN-42 — Nome do autor:** haverá limite de caracteres para o nome informado pelo convidado?
