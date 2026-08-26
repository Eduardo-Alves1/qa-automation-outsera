import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('.title');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  productAddButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  async addProductToCart(productSlug: string): Promise<void> {
    await this.productAddButton(productSlug).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
