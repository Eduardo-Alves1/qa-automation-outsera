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

  @negative @regression
  Cenário: Impedir Login sem informar usuário
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário tenta realizar o login sem informar o usuário
    Então uma mensagem informando que o usuário é obrigatório deve ser exibida

  @negative @regression
  Cenário: Impedir Login sem informar senha
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário tenta realizar o login sem informar a senha
    Então uma mensagem informando que a senha é obrigatória deve ser exibida

  @negative @regression
  Cenário: Impedir Login com usuário bloqueado
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário tenta realizar o login com um usuário bloqueado
    Então uma mensagem informando que o usuário está bloqueado deve ser exibida