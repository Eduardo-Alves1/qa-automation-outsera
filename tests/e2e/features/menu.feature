# language: pt
@e2e @menu
Funcionalidade: Menu lateral
  Como cliente autenticado
  Quero utilizar as opções do menu
  Para navegar pelo catálogo e controlar minha sessão

  Contexto:
    Dado que o usuário está autenticado no SauceDemo

  @positive @smoke @regression
  Cenário: Realizar logout
    Quando o usuário abre o menu lateral
    E seleciona a opção Logout
    Então a página de login deve ser exibida

  @positive @regression
  Cenário: Resetar o estado da aplicação
    Dado que o usuário adicionou um produto ao carrinho
    Quando o usuário abre o menu lateral
    E seleciona a opção Reset App State
    Então o carrinho deve ficar vazio

  @positive @regression
  Cenário: Retornar para a lista de produtos pelo menu
    Dado que o usuário está na página do carrinho
    Quando o usuário abre o menu lateral
    E seleciona a opção All Items
    Então a página de produtos deve ser exibida
