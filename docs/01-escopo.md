# Escopo do projeto

## 1. Identificação

- **Nome do projeto:** Celebrarte
- **Versão do documento:** 1.0
- **Status:** Em elaboração
- **Responsáveis:**
  - [@Gabriel Tertuliano](https://github.com/)
  - [@Hellen Lima](https://github.com/hellenilda)
- **Data de criação:** 17/10/2026

---

## 2. Contexto e problema

**Problema identificado:**

Reunir homenagens de várias pessoas para um aniversariante costuma ser um processo desorganizado. As mensagens e fotos ficam espalhadas em conversas privadas, grupos de mensagens e redes sociais, o que dificulta coletá-las em um único lugar e apresentá-las de forma bonita e organizada ao homenageado.

**Contexto:**

Quem quer organizar uma surpresa de aniversário para um amigo, familiar ou colega de trabalho precisa pedir individualmente que cada pessoa envie uma foto ou mensagem, juntar esse material manualmente e, depois, encontrar uma forma de apresentá-lo. O organizador perde tempo centralizando o conteúdo, os convidados nem sempre sabem para onde enviar suas homenagens e, muitas vezes, precisam instalar aplicativos ou criar contas para participar. E o aniversariante acaba recebendo as homenagens aos pedaços.

---

## 3. Objetivo do projeto

**Objetivo geral:**

Desenvolver uma aplicação web que permita a um usuário criar uma celebração de aniversário, compartilhar um link para que convidados enviem homenagens (foto e/ou mensagem) sem precisar de cadastro e disponibilizar um mural público onde todas as homenagens são exibidas de forma organizada ao aniversariante e demais pessoas com acesso ao link.

**Objetivos específicos:**

- Permitir que usuários cadastrados criem e administrem suas próprias celebrações.
- Gerar, para cada celebração, um link exclusivo de contribuição e um link exclusivo do mural.
- Permitir que convidados enviem homenagens com imagem, mensagem ou ambas, sem necessidade de conta.
- Exibir as homenagens em um mural público, acessível por qualquer pessoa que possua o link.
- Garantir a separação entre o acesso público (contribuição e mural) e o acesso administrativo da celebração.

---

## 4. Público-alvo

| Público               | Descrição                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Organizador (usuário) | Pessoa cadastrada que cria a celebração, compartilha os links, acompanha as homenagens recebidas e administra a celebração.         |
| Convidado             | Pessoa que recebe o link de contribuição e envia uma homenagem (foto e/ou mensagem) sem precisar criar conta.                       |
| Visitante do mural    | Qualquer pessoa com o link do mural (inclusive o aniversariante) que visualiza a celebração e as homenagens enviadas.             |
| Aniversariante        | Principal beneficiado: recebe, em um único lugar, as homenagens de amigos, familiares e colegas.                                     |

---

## 5. Descrição da solução

O Celebrarte é uma aplicação web responsiva composta por uma área administrativa, acessível somente a usuários autenticados, e por duas páginas públicas associadas a cada celebração: o formulário de contribuição e o mural.

O organizador cria uma celebração informando o nome do aniversariante e a data. O sistema gera automaticamente dois links exclusivos: um para que os convidados enviem homenagens e outro para visualização do mural. Os convidados acessam o formulário, anexam uma imagem e/ou escrevem uma mensagem e enviam a homenagem, que passa a aparecer imediatamente no mural, sem necessidade de aprovação. O envio de homenagens é encerrado dois dias após a data do aniversário.

O organizador deve conseguir criar a celebração em poucos passos, e o convidado deve conseguir participar sem cadastro e sem conhecimento técnico.

### 5.1. Funcionamento geral

1. O organizador cria uma conta e realiza login no Celebrarte.
2. O organizador cria uma celebração informando o nome do aniversariante e a data, e recebe o link de contribuição e o link do mural.
3. O organizador compartilha o link de contribuição com os convidados, que enviam suas homenagens (imagem, mensagem ou ambas) até dois dias após a data do aniversário.
4. O organizador compartilha o link do mural com o aniversariante e demais pessoas, que visualizam todas as homenagens reunidas em um só lugar.

---

## 6. Escopo funcional

### 6.1. Funcionalidades incluídas

**Conta e autenticação**

- Cadastro de usuário (RF-01).
- Login e logout (RF-02, RF-03).

**Gestão de celebrações (área administrativa)**

- Criação de celebração com nome do aniversariante e data (RF-04 a RF-06, RN-05).
- Geração automática de links exclusivos de contribuição e do mural (RF-07, RF-08, RN-07, RN-08).
- Listagem das celebrações do usuário e visualização de seus detalhes (RF-09, RF-10).
- Visualização das homenagens recebidas (RF-11).
- Edição e exclusão de celebrações (RN-31, RN-32).
- Exclusão de homenagens pelo responsável (RN-30).

**Envio de homenagens (link de contribuição)**

- Acesso ao formulário público sem necessidade de conta (RF-12, RN-17).
- Envio de homenagem com uma imagem, uma mensagem ou ambas (RF-13 a RF-15, RN-11 a RN-14, RN-36).
- Validação de formato e tamanho da imagem e limite de 2.000 caracteres na mensagem (RN-15, RN-37, RNF-05 a RNF-07).
- Confirmação de envio ao convidado (RF-16).
- Encerramento automático do recebimento de homenagens dois dias após a data do aniversário (RN-33).

**Mural (link do mural)**

- Acesso público ao mural por meio do link, sem autenticação (RF-17, RN-18).
- Exibição do título com o nome do aniversariante (RF-18).
- Exibição das homenagens, imagens e mensagens, mostrando somente os elementos disponíveis em cada uma (RF-19 a RF-21, RN-20 a RN-22).
- Publicação imediata das homenagens, sem moderação prévia (RN-34).

### 6.2. Funcionalidades fora do escopo

Os itens abaixo ficam fora da versão atual e podem ser reavaliados em versões futuras.

- Moderação ou aprovação prévia de homenagens antes da publicação no mural.
- Envio de mais de uma imagem por homenagem, vídeos, áudios ou GIFs.
- Edição ou exclusão de homenagens pelo próprio convidado.
- Comentários, curtidas ou reações às homenagens no mural.
- Celebrações de outros tipos de evento além de aniversários (casamentos, formaturas, despedidas etc.).
- Personalização visual do mural (temas, cores, layouts).
- Notificações por e-mail, SMS ou push.
- Login social (Google, Facebook etc.) e recuperação de senha.
- Administração compartilhada de uma celebração por mais de um usuário.
- Exportação do mural (PDF, vídeo ou álbum para impressão).
- Aplicativo móvel nativo.
- Funcionalidades pagas ou integração com meios de pagamento.

---

## 7. Premissas

- Os usuários terão acesso à internet e a um navegador atualizado, em dispositivos móveis, tablets ou desktops.
- O organizador será responsável por compartilhar os links de contribuição e do mural pelos canais que preferir (WhatsApp, e-mail, redes sociais etc.).
- Quem possui o link do mural está autorizado a visualizar as homenagens, já que o acesso não exige autenticação.
- Os convidados enviarão conteúdo adequado, uma vez que não haverá moderação prévia; o responsável poderá excluir homenagens indesejadas.
- Haverá um serviço de Object Storage disponível para armazenamento das imagens.

---

## 8. Critérios de sucesso

- Um usuário consegue se cadastrar, criar uma celebração e obter os dois links públicos sem auxílio externo.
- Um convidado consegue enviar uma homenagem pelo link de contribuição, sem criar conta, e recebe a confirmação de envio.
- Toda homenagem válida enviada aparece imediatamente no mural da celebração correta.
- Imagens fora dos formatos permitidos ou acima do limite e mensagens acima de 2.000 caracteres são rejeitadas com mensagem de erro clara.
- Após o prazo de encerramento (dois dias após o aniversário), novos envios são bloqueados.
- Nenhum link público concede acesso às funcionalidades administrativas ou a dados de outra celebração.
- Um usuário não consegue visualizar ou administrar celebrações de outro usuário.
- A interface funciona corretamente em celulares, tablets e desktops.
- Todos os critérios de aceitação definidos em [02-requisitos.md](02-requisitos.md) são atendidos.

---

## 9. Entregáveis

- Aplicação frontend (React).
- API/backend (Spring Boot).
- Banco de dados PostgreSQL com migrações versionadas (Flyway).
- Configuração de containerização (Docker / docker-compose).
- Documentação técnica (escopo, requisitos, regras de negócio, modelo de dados e arquitetura).
- Aplicação publicada. [Confirmar se a publicação faz parte do escopo.]

---

## 10. Definição de conclusão

O projeto será considerado concluído quando:

- Todos os requisitos funcionais (RF-01 a RF-21) e as regras de negócio (RN-01 a RN-37) estiverem implementados.
- Os requisitos não funcionais de segurança, autorização, validação de uploads e responsividade estiverem atendidos.
- Os critérios de aceitação documentados estiverem validados por testes.
- As funcionalidades previstas para a versão atual estiverem implementadas e testadas.
- A documentação técnica estiver atualizada e coerente com a implementação.
- A entrega ou publicação tiver sido realizada.