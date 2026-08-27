import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import { expect } from '@playwright/test';

import { E2EWorld } from '../support/world';

import {
  e2eUsers,
  checkoutData,
  products
} from '../data/users.data';

function extractCurrencyValue(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(value)) {
    throw new Error(`Não foi possível converter o valor monetário: ${text}`);
  }

  return value;
}

Given(
  'que o usuário está autenticado no SauceDemo',
  async function (this: E2EWorld) {

    const baseUrl = process.env.E2E_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        'A variável E2E_BASE_URL não está configurada.'
      );
    }

    await this.loginPage!.open(baseUrl);

    await this.loginPage!.login(
      e2eUsers.standard.username,
      e2eUsers.standard.password
    );

    await expect(
      this.inventoryPage!.title
    ).toHaveText('Products');
  }
);

When(
  'o usuário adiciona um produto ao carrinho',
  async function (this: E2EWorld) {

    await this.inventoryPage!.addProductToCart(
      products.backpack
    );
  }
);

When(
  'acessa o carrinho',
  async function (this: E2EWorld) {

    await this.inventoryPage!.openCart();

    await expect(
      this.cartPage!.cartItems
    ).toHaveCount(1);
  }
);

When(
  'inicia o checkout',
  async function (this: E2EWorld) {

    await this.cartPage!.startCheckout();

    await expect(
      this.checkoutPage!.firstNameInput
    ).toBeVisible();
  }
);

When(
  'preenche os dados do checkout com informações válidas',
  async function (this: E2EWorld) {

    await this.checkoutPage!.fillCustomerInformation(
      checkoutData.valid.firstName,
      checkoutData.valid.lastName,
      checkoutData.valid.postalCode
    );

    await this.checkoutPage!.continue();
  }
);

When(
  'finaliza a compra',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.finishButton
    ).toBeVisible();

    await this.checkoutPage!.finish();
  }
);

Then(
  'a mensagem de conclusão do pedido deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.completeHeader
    ).toBeVisible();

    await expect(
      this.checkoutPage!.completeHeader
    ).toHaveText(
      'Thank you for your order!'
    );
  }
);

When(
  'continua o checkout sem preencher os dados obrigatórios',
  async function (this: E2EWorld) {

    await this.checkoutPage!.continue();
  }
);

Then(
  'uma mensagem de erro de validação do checkout deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.errorMessage
    ).toHaveText(
      'Error: First Name is required'
    );
  }
);

When(
  'preenche somente sobrenome e CEP',
  async function (this: E2EWorld) {

    await this.checkoutPage!.fillCustomerInformation(
      '',
      checkoutData.valid.lastName,
      checkoutData.valid.postalCode
    );

    await this.checkoutPage!.continue();
  }
);

Then(
  'uma mensagem informando que o nome é obrigatório deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.errorMessage
    ).toHaveText(
      'Error: First Name is required'
    );
  }
);

When(
  'preenche somente nome e CEP',
  async function (this: E2EWorld) {

    await this.checkoutPage!.fillCustomerInformation(
      checkoutData.valid.firstName,
      '',
      checkoutData.valid.postalCode
    );

    await this.checkoutPage!.continue();
  }
);

Then(
  'uma mensagem informando que o sobrenome é obrigatório deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.errorMessage
    ).toHaveText(
      'Error: Last Name is required'
    );
  }
);

When(
  'preenche somente nome e sobrenome',
  async function (this: E2EWorld) {

    await this.checkoutPage!.fillCustomerInformation(
      checkoutData.valid.firstName,
      checkoutData.valid.lastName,
      ''
    );

    await this.checkoutPage!.continue();
  }
);

Then(
  'uma mensagem informando que o CEP é obrigatório deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.errorMessage
    ).toHaveText(
      'Error: Postal Code is required'
    );
  }
);

Then(
  'o produto selecionado deve estar presente no resumo do pedido',
  async function (this: E2EWorld) {

    await expect(
      this.checkoutPage!.summaryItemNames
    ).toContainText([
      products.backpackName
    ]);
  }
);

Then(
  'subtotal, imposto e total devem ser exibidos corretamente',
  async function (this: E2EWorld) {

    await expect(this.checkoutPage!.subtotalLabel).toBeVisible();
    await expect(this.checkoutPage!.taxLabel).toBeVisible();
    await expect(this.checkoutPage!.totalLabel).toBeVisible();

    const subtotalText = await this.checkoutPage!.subtotalLabel.innerText();
    const taxText = await this.checkoutPage!.taxLabel.innerText();
    const totalText = await this.checkoutPage!.totalLabel.innerText();

    const subtotal = extractCurrencyValue(subtotalText);
    const tax = extractCurrencyValue(taxText);
    const total = extractCurrencyValue(totalText);

    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }
);
