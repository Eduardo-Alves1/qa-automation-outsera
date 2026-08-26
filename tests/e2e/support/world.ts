import {
  IWorldOptions,
  setWorldConstructor,
  World
} from '@cucumber/cucumber';

import type {
  Browser,
  BrowserContext,
  Page
} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export class E2EWorld extends World {

  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  loginPage?: LoginPage;
  inventoryPage?: InventoryPage;
  cartPage?: CartPage;
  checkoutPage?: CheckoutPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async dispose(): Promise<void> {

    await this.context?.close();
    await this.browser?.close();

    this.page = undefined;
    this.context = undefined;
    this.browser = undefined;

    this.loginPage = undefined;
    this.inventoryPage = undefined;
    this.cartPage = undefined;
    this.checkoutPage = undefined;
  }
}

setWorldConstructor(E2EWorld);