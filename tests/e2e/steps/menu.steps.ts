import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { E2EWorld } from '../support/world';
import { products } from '../data/users.data';

Given(
  'que o usuário adicionou um produto ao carrinho',
  async function (this: E2EWorld) {
    await this.inventoryPage!.addProductToCart(products.backpack.slug);

    await expect(this.inventoryPage!.cartBadge).toHaveText('1');
    await expect(
      this.inventoryPage!.productRemoveButton(products.backpack.slug)
    ).toBeVisible();
  }
);

Given(
  'que o usuário está na página do carrinho',
  async function (this: E2EWorld) {
    await this.inventoryPage!.addProductToCart(products.backpack.slug);
    await this.inventoryPage!.openCart();

    await expect(this.page!).toHaveURL(/\/cart\.html$/);
    await expect(this.cartPage!.title).toHaveText('Your Cart');
    await expect(this.cartPage!.cartItems).toHaveCount(1);
    await expect(this.cartPage!.itemNames).toHaveText([
      products.backpack.name
    ]);
  }
);

When(
  'o usuário abre o menu lateral',
  async function (this: E2EWorld) {
    await this.menuPage!.open();

    await expect(this.menuPage!.allItemsLink).toBeVisible();
    await expect(this.menuPage!.logoutLink).toBeVisible();
    await expect(this.menuPage!.resetAppStateLink).toBeVisible();
  }
);

When(
  'seleciona a opção Logout',
  async function (this: E2EWorld) {
    await this.menuPage!.logout();
  }
);

Then(
  'a página de login deve ser exibida',
  async function (this: E2EWorld) {
    await expect(this.page!).not.toHaveURL(/inventory\.html/);
    await expect(this.loginPage!.loginLogo).toHaveText('Swag Labs');
    await expect(this.loginPage!.usernameInput).toBeVisible();
    await expect(this.loginPage!.passwordInput).toBeVisible();
    await expect(this.loginPage!.loginButton).toBeVisible();
  }
);

When(
  'seleciona a opção Reset App State',
  async function (this: E2EWorld) {
    await this.menuPage!.resetAppState();
  }
);

Then(
  'o carrinho deve ficar vazio',
  async function (this: E2EWorld) {
    await expect(this.inventoryPage!.cartBadge).toBeHidden();

    // O reset atualiza o estado da aplicação, mas o botão do produto
    // só reflete esse novo estado depois que a página é carregada novamente.
    await this.page!.reload();

    await expect(this.page!).toHaveURL(/\/inventory\.html$/);
    await expect(this.inventoryPage!.cartBadge).toBeHidden();
    await expect(
      this.inventoryPage!.productAddButton(products.backpack.slug)
    ).toBeVisible();
  }
);

When(
  'seleciona a opção All Items',
  async function (this: E2EWorld) {
    await this.menuPage!.goToAllItems();
  }
);
