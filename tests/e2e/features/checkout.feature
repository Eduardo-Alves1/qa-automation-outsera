# language: pt
@e2e @checkout
Funcionalidade: Checkout
  Como cliente autenticado
  Quero concluir uma compra
  Para validar o fluxo completo de checkout

  Contexto:
    Dado que o usuário está autenticado no SauceDemo
    E o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout

  @positive @smoke @regression
  Cenário: Concluir checkout com sucesso
    Quando preenche os dados do checkout com informações válidas
    E finaliza a compra
    Então a mensagem de conclusão do pedido deve ser exibida

  # Conforme pontuado na avaliação, as variações dos campos obrigatórios
  # foram reunidas em um Scenario Outline para reduzir repetição no Gherkin.
  @negative @regression
  Esquema do Cenário: Validar campos obrigatórios do checkout
    Quando preenche o checkout sem informar "<campo>"
    Então a mensagem de validação do checkout "<mensagem>" deve ser exibida

    Exemplos:
      | campo     | mensagem                       |
      | nome      | Error: First Name is required  |
      | sobrenome | Error: Last Name is required   |
      | CEP       | Error: Postal Code is required |

  @positive @regression
  Cenário: Validar produto no resumo do checkout
    Quando preenche os dados do checkout com informações válidas
    Então o produto selecionado deve estar presente no resumo do pedido

  @positive @regression
  Cenário: Validar valores do resumo do pedido
    Quando preenche os dados do checkout com informações válidas
    Então subtotal, imposto e total devem ser exibidos corretamente
