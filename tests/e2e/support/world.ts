import type { Browser, BrowserContext, Page } from '@playwright/test';

export class E2EWorldState {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  async dispose(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();

    this.page = undefined;
    this.context = undefined;
    this.browser = undefined;
  }
}
