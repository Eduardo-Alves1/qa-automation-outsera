import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemQuantities = page.locator('.cart_quantity');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
