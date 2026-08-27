import { Locator, Page } from '@playwright/test';

export class MenuPage {
  readonly openMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(private readonly page: Page) {
    this.openMenuButton = page.locator('#react-burger-menu-btn');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  async open(): Promise<void> {
    await this.openMenuButton.click();
    await this.allItemsLink.waitFor({ state: 'visible' });
  }

  async goToAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }
}
