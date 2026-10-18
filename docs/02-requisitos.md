## 1. Tipos de usuário:

### 1.1 Usuário autenticado

É a pessoa que cria e administra uma celebração.
Pode:

- criar celebrações;
- visualizar suas celebrações;
- acessar as informações da celebração;
- obter os links de contribuição e do mural;
- acompanhar as homenagens recebidas;
- administrar sua celebração.

### 1.2 Convidado

É a pessoa que recebe o link de contribuição.
Não precisa possuir conta.
Pode:

- acessar o formulário através do link;
- enviar uma foto;
- escrever uma mensagem;
- enviar sua homenagem.

### 1.3 Visitante do mural

É qualquer pessoa que possui o link do mural.
Não precisa possuir conta.
Pode:

- acessar o mural;
- visualizar as informações da celebração;
- visualizar as homenagens.

> Observação: convidado e visitante podem ser a mesma pessoa. Estamos separando os papéis porque as permissões são diferentes.

---

# 2. Requisitos Funcionais

| Número | Nome                            | Descrição                                                                                                       |
| ------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| RF-01  | Cadastro                        | O sistema deve permitir que uma pessoa crie uma conta.                                                          |
| RF-02  | Login                           | O sistema deve permitir que um usuário cadastrado realize login.                                                |
| RF-03  | Logout                          | O sistema deve permitir que um usuário autenticado encerre sua sessão.                                          |
| RF-04  | Criar celebração                | O sistema deve permitir que um usuário autenticado crie uma celebração.                                         |
| RF-05  | Informar aniversariante         | O sistema deve permitir informar o nome do aniversariante.                                                      |
| RF-06  | Informar data                   | O sistema deve permitir informar a data da celebração.                                                          |
| RF-07  | Gerar link de contribuição      | Ao criar uma celebração, o sistema deve disponibilizar um link exclusivo para que convidados enviem homenagens. |
| RF-08  | Gerar link do mural             | Ao criar uma celebração, o sistema deve disponibilizar um link exclusivo para visualização do mural.            |
| RF-09  | Listar celebrações              | O sistema deve permitir que o usuário autenticado visualize as celebrações que criou.                           |
| RF-10  | Visualizar detalhes             | O sistema deve permitir que o usuário autenticado visualize os dados de uma celebração que criou.               |
| RF-11  | Visualizar homenagens recebidas | O sistema deve permitir que o usuário autenticado visualize as homenagens recebidas em sua celebração.          |
| RF-12  | Acessar formulário público      | O sistema deve permitir que uma pessoa acesse o formulário de homenagem através do link de contribuição.        |
| RF-13  | Anexar imagem                   | O sistema deve permitir que o convidado anexe uma imagem à homenagem.                                           |
| RF-14  | Informar mensagem               | O sistema deve permitir que o convidado escreva uma mensagem para o aniversariante.                             |
| RF-15  | Enviar homenagem                | O sistema deve permitir que o convidado envie sua homenagem.                                                    |
| RF-16  | Confirmar envio                 | Após o envio bem-sucedido, o sistema deve informar ao convidado que sua homenagem foi registrada.               |
| RF-17  | Acessar mural                   | O sistema deve permitir que qualquer pessoa com o link do mural visualize a celebração.                         |
| RF-18  | Exibir título                   | O sistema deve exibir uma mensagem de celebração contendo o nome do aniversariante.                             |
| RF-19  | Exibir homenagens               | O sistema deve exibir as homenagens associadas à celebração.                                                    |
| RF-20  | Exibir imagens                  | O sistema deve exibir as imagens enviadas pelos convidados.                                                     |
| RF-21  | Exibir mensagens                | O sistema deve exibir as mensagens enviadas pelos convidados.                                                   |

---

# 3. Requisitos Não Funcionais

| Número | Nome                 | Descrição                                                                                                                        |
| ------ | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| RNF-01 | Responsividade       | O sistema deve possuir interface adaptável para dispositivos móveis, tablets e desktops.                                         |
| RNF-02 | Segurança            | O sistema deve proteger as credenciais dos usuários e não armazenar senhas em texto puro.                                        |
| RNF-03 | Autorização          | O sistema deve impedir que um usuário administre celebrações pertencentes a outro usuário.                                       |
| RNF-04 | Segurança dos links  | Os links públicos de contribuição e visualização não devem conceder acesso às funcionalidades administrativas da celebração.     |
| RNF-05 | Validação de uploads | O sistema deve validar os arquivos de imagem enviados pelos convidados.                                                          |
| RNF-06 | Limite de upload     | O sistema deve estabelecer um tamanho máximo para imagens enviadas.                                                              |
| RNF-07 | Formatos de imagem   | O sistema deve aceitar somente formatos de imagem previamente definidos.                                                         |
| RNF-08 | Desempenho           | O mural deve carregar as imagens de maneira otimizada, evitando o carregamento desnecessário de arquivos excessivamente grandes. |
| RNF-09 | Disponibilidade      | O sistema deve informar adequadamente ao usuário quando uma operação não puder ser concluída.                                    |
| RNF-10 | Usabilidade          | As principais funcionalidades devem poder ser utilizadas sem conhecimento técnico prévio.                                        |
| RNF-11 | Acessibilidade       | A interface deve seguir boas práticas de acessibilidade, incluindo identificação adequada de campos e elementos interativos.     |
| RNF-12 | Privacidade          | O sistema deve coletar e armazenar somente os dados necessários para o funcionamento da aplicação.                               |

---

# 4. Critérios de aceitação

| Número | Nome                 | Critérios                                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-04  | Criar celebração     | - Dado que o usuário está autenticado, quando preencher os dados obrigatórios e confirmar, então uma nova celebração deve ser criada. - Dado que o usuário não está autenticado, quando tentar criar uma celebração, então o sistema deve solicitar autenticação. - Dado que um campo obrigatório não foi preenchido, quando o usuário tentar criar a celebração, então o sistema deve informar o erro. |
| RF-07  | Link de contribuição | - Dado que uma celebração foi criada, então o sistema deve disponibilizar um link de contribuição. - O link deve permitir acesso ao formulário público. - O link não deve permitir acesso às funcionalidades administrativas.                                                                                                                                                                           |
| RF-14  | Anexar imagem        | - O sistema deve aceitar somente os formatos definidos. - O sistema deve rejeitar arquivos acima do limite definido. - O sistema deve informar o usuário quando o arquivo não for aceito.                                                                                                                                                                                                               |
| RF-16  | Enviar homenagem     | - Uma homenagem deve possuir pelo menos uma mensagem ou uma imagem. - Após o envio válido, a homenagem deve ser associada à celebração. - Após o envio, o convidado deve receber uma confirmação.                                                                                                                                                                                                       |
| RF-20  | Exibir homenagens    | - Dado que existem homenagens, o mural deve apresentá-las. - Cada homenagem deve apresentar os elementos disponíveis. - Uma homenagem sem imagem deve continuar podendo ser exibida. - Uma homenagem sem mensagem deve continuar podendo ser exibida.                                                                                                                                                   |
