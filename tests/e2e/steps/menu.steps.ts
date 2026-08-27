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

    await this.inventoryPage!.addProductToCart(
      products.backpack
    );

    await expect(
      this.inventoryPage!.cartBadge
    ).toHaveText('1');
  }
);

Given(
  'que o usuário está na página do carrinho',
  async function (this: E2EWorld) {

    await this.inventoryPage!.addProductToCart(
      products.backpack
    );

    await this.inventoryPage!.openCart();

    await expect(
      this.cartPage!.cartItems
    ).toHaveCount(1);
  }
);

When(
  'o usuário abre o menu lateral',
  async function (this: E2EWorld) {

    await this.menuPage!.open();
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

    await expect(
      this.loginPage!.loginButton
    ).toBeVisible();
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

    await expect(
      this.inventoryPage!.cartBadge
    ).toBeHidden();
  }
);

When(
  'seleciona a opção All Items',
  async function (this: E2EWorld) {

    await this.menuPage!.goToAllItems();
  }
);
