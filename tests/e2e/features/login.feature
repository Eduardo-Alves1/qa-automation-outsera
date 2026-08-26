# language: pt
@e2e @login
Funcionalidade: Login
  Como cliente
  Quero me autenticar no SauceDemo
  Para acessar o catálogo de produtos

  @positive @smoke @regression
  Cenário: Realizar login com credenciais válidas
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário realiza o login com credenciais válidas
    Então a página de produtos deve ser exibida

  @negative @regression
  Cenário: Rejeitar login com credenciais inválidas
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário realiza o login com credenciais inválidas
    Então uma mensagem de erro de login deve ser exibida
