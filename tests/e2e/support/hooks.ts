import {
  After,
  Before,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';

import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

import { E2EWorld } from './world';

import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MenuPage } from '../pages/MenuPage';

dotenv.config();

setDefaultTimeout(30_000);

Before(async function (this: E2EWorld) {
  const isCI = process.env.CI === 'true';

  this.browser = await chromium.launch({
    headless: isCI,
    slowMo: isCI ? 0 : 1000
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  this.loginPage = new LoginPage(this.page);
  this.inventoryPage = new InventoryPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.checkoutPage = new CheckoutPage(this.page);
  this.menuPage = new MenuPage(this.page);
});

After(async function (this: E2EWorld, scenario) {
  if (
    scenario.result?.status === Status.FAILED &&
    this.page
  ) {
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    await this.attach(
      screenshot,
      'image/png'
    );
  }

  await this.dispose();
});
