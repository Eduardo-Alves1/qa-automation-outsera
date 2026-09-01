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
  Esquema do Cenário: Validar campos obrigatórios do login
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário tenta realizar o login sem informar "<campo>"
    Então a mensagem de validação de login "<mensagem>" deve ser exibida

    Exemplos:
      | campo   | mensagem                           |
      | usuário | Epic sadface: Username is required |
      | senha   | Epic sadface: Password is required |

  @negative @regression
  Cenário: Impedir login com usuário bloqueado
    Dado que o usuário está na página de login do SauceDemo
    Quando o usuário tenta realizar o login com um usuário bloqueado
    Então uma mensagem informando que o usuário está bloqueado deve ser exibida
