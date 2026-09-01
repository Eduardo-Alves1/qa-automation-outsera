import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { environmentConfig } from '../../../config/environments';
import { E2EWorld } from '../support/world';
import {
  createCheckoutData,
  e2eUsers,
  products
} from '../data/users.data';

function extractCurrencyValue(text: string): number {
  const value = Number(text.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(value)) {
    throw new Error(`Não foi possível converter o valor monetário: ${text}`);
  }

  return value;
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

Given(
  'que o usuário está autenticado no SauceDemo',
  async function (this: E2EWorld) {
    await this.loginPage!.open(environmentConfig.e2e.baseUrl);
    await this.loginPage!.login(
      e2eUsers.standard.username,
      e2eUsers.standard.password
    );

    await expect(this.page!).toHaveURL(/\/inventory\.html$/);
    await expect(this.inventoryPage!.title).toHaveText('Products');
    await expect(this.inventoryPage!.inventoryList).toBeVisible();
  }
);

When(
  'o usuário adiciona um produto ao carrinho',
  async function (this: E2EWorld) {
    await this.inventoryPage!.addProductToCart(products.backpack.slug);

    await expect(this.inventoryPage!.cartBadge).toHaveText('1');
    await expect(
      this.inventoryPage!.productRemoveButton(products.backpack.slug)
    ).toBeVisible();
  }
);

When(
  'acessa o carrinho',
  async function (this: E2EWorld) {
    await this.inventoryPage!.openCart();

    // Conforme pontuado na avaliação, as validações E2E foram ampliadas para
    // confirmar o estado funcional: rota, produto, preço e quantidade.
    await expect(this.page!).toHaveURL(/\/cart\.html$/);
    await expect(this.cartPage!.title).toHaveText('Your Cart');
    await expect(this.cartPage!.cartItems).toHaveCount(1);
    await expect(this.cartPage!.itemNames).toHaveText([
      products.backpack.name
    ]);
    await expect(this.cartPage!.itemPrices).toHaveText([
      formatPrice(products.backpack.price)
    ]);
    await expect(this.cartPage!.itemQuantities).toHaveText(['1']);
  }
);

When(
  'inicia o checkout',
  async function (this: E2EWorld) {
    await this.cartPage!.startCheckout();

    await expect(this.page!).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.checkoutPage!.title)
      .toHaveText('Checkout: Your Information');
    await expect(this.checkoutPage!.firstNameInput).toBeVisible();
    await expect(this.checkoutPage!.lastNameInput).toBeVisible();
    await expect(this.checkoutPage!.postalCodeInput).toBeVisible();
    await expect(this.checkoutPage!.continueButton).toBeVisible();
  }
);

When(
  'preenche os dados do checkout com informações válidas',
  async function (this: E2EWorld) {
    this.checkoutData = createCheckoutData();

    await this.checkoutPage!.fillCustomerInformation(
      this.checkoutData.firstName,
      this.checkoutData.lastName,
      this.checkoutData.postalCode
    );

    await this.checkoutPage!.continue();

    await expect(this.page!).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.checkoutPage!.title).toHaveText('Checkout: Overview');
    await expect(this.checkoutPage!.finishButton).toBeVisible();
  }
);

When(
  'preenche o checkout sem informar {string}',
  async function (this: E2EWorld, field: string) {
    const data = createCheckoutData();

    if (field === 'nome') {
      data.firstName = '';
    } else if (field === 'sobrenome') {
      data.lastName = '';
    } else if (field === 'CEP') {
      data.postalCode = '';
    } else {
      throw new Error(`Campo de checkout não reconhecido: ${field}`);
    }

    this.checkoutData = data;

    await this.checkoutPage!.fillCustomerInformation(
      data.firstName,
      data.lastName,
      data.postalCode
    );

    await this.checkoutPage!.continue();
  }
);

Then(
  'a mensagem de validação do checkout {string} deve ser exibida',
  async function (this: E2EWorld, message: string) {
    await expect(this.page!).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.checkoutPage!.errorMessage).toHaveText(message);
    await expect(this.checkoutPage!.continueButton).toBeVisible();
  }
);

When(
  'finaliza a compra',
  async function (this: E2EWorld) {
    await expect(this.checkoutPage!.finishButton).toBeVisible();
    await this.checkoutPage!.finish();
  }
);

Then(
  'a mensagem de conclusão do pedido deve ser exibida',
  async function (this: E2EWorld) {
    await expect(this.page!).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.checkoutPage!.completeHeader).toHaveText(
      'Thank you for your order!'
    );
    await expect(this.checkoutPage!.completeText).toContainText(
      'Your order has been dispatched'
    );
    await expect(this.checkoutPage!.backHomeButton).toBeVisible();
    await expect(this.inventoryPage!.cartBadge).toBeHidden();
  }
);

Then(
  'o produto selecionado deve estar presente no resumo do pedido',
  async function (this: E2EWorld) {
    await expect(this.page!).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.checkoutPage!.summaryItemNames).toHaveText([
      products.backpack.name
    ]);
    await expect(this.checkoutPage!.summaryItemPrices).toHaveText([
      formatPrice(products.backpack.price)
    ]);
    await expect(this.checkoutPage!.summaryItemQuantities).toHaveText(['1']);
  }
);

Then(
  'subtotal, imposto e total devem ser exibidos corretamente',
  async function (this: E2EWorld) {
    await expect(this.checkoutPage!.subtotalLabel).toBeVisible();
    await expect(this.checkoutPage!.taxLabel).toBeVisible();
    await expect(this.checkoutPage!.totalLabel).toBeVisible();

    const subtotal = extractCurrencyValue(
      await this.checkoutPage!.subtotalLabel.innerText()
    );
    const tax = extractCurrencyValue(
      await this.checkoutPage!.taxLabel.innerText()
    );
    const total = extractCurrencyValue(
      await this.checkoutPage!.totalLabel.innerText()
    );

    expect(subtotal).toBe(products.backpack.price);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(subtotal);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }
);
