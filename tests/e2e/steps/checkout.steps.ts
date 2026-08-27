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


Given(
  'que o usuário está autenticado no SauceDemo',
  async function (this: E2EWorld) {

    const baseUrl = process.env.E2E_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        'A variável E2E_BASE_URL não está configurada.'
      );
    }

    // Acessa o SauceDemo
    await this.loginPage!.open(baseUrl);

    // Realiza o login
    await this.loginPage!.login(
      e2eUsers.standard.username,
      e2eUsers.standard.password
    );

    // Garante que o login realmente funcionou
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
    ).toBeVisible();

    await expect(
      this.checkoutPage!.errorMessage
    ).toContainText(
      'First Name is required'
    );
  }
);