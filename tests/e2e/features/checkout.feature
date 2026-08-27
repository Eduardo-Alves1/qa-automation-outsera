# language: pt
@e2e @checkout
Funcionalidade: Checkout
  Como cliente autenticado
  Quero concluir uma compra
  Para validar o fluxo completo de checkout

  @positive @smoke @regression
  Cenário: Concluir checkout com sucesso
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche os dados do checkout com informações válidas
    E finaliza a compra
    Então a mensagem de conclusão do pedido deve ser exibida

  @negative @regression
  Cenário: Impedir checkout sem dados obrigatórios do cliente
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E continua o checkout sem preencher os dados obrigatórios
    Então uma mensagem de erro de validação do checkout deve ser exibida

  @negative @regression
  Cenário: Impedir checkout sem nome
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche somente sobrenome e CEP
    Então uma mensagem informando que o nome é obrigatório deve ser exibida

  @negative @regression
  Cenário: Impedir checkout sem sobrenome
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche somente nome e CEP
    Então uma mensagem informando que o sobrenome é obrigatório deve ser exibida

  @negative @regression
  Cenário: Impedir checkout sem CEP
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche somente nome e sobrenome
    Então uma mensagem informando que o CEP é obrigatório deve ser exibida

  @positive @regression
  Cenário: Validar produto no resumo do checkout
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche os dados do checkout com informações válidas
    Então o produto selecionado deve estar presente no resumo do pedido

  @positive @regression
  Cenário: Validar valores do resumo do pedido
    Dado que o usuário está autenticado no SauceDemo
    Quando o usuário adiciona um produto ao carrinho
    E acessa o carrinho
    E inicia o checkout
    E preenche os dados do checkout com informações válidas
    Então subtotal, imposto e total devem ser exibidos corretamente
