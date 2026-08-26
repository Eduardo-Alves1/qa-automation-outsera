import { Given, When, Then } from '@cucumber/cucumber';
import { expect} from '@playwright/test';
import { E2EWorld } from '../support/world';
import { e2eUsers } from '../data/users.data';

Given('que o usuário está na página de login do SauceDemo', async function (this: E2EWorld) {
  const baseUrl = process.env.E2E_BASE_URL;
  
    await this.page?.goto(baseUrl || '');
});

When('o usuário realiza o login com credenciais válidas', async function (this: E2EWorld) {

  await this.loginPage?.login(e2eUsers.standard.username, e2eUsers.standard.password);
});

Then('a página de produtos deve ser exibida', async function (this: E2EWorld) {
  await expect(this.inventoryPage!.title).toHaveText('Products');
});


When(
  'o usuário realiza o login com credenciais inválidas',
  async function (this: E2EWorld) {

    await this.loginPage!.login(
      e2eUsers.invalid.username,
      e2eUsers.invalid.password
    );
  }
);

Then(
  'uma mensagem de erro de login deve ser exibida',
  async function (this: E2EWorld) {

    await expect(
      this.loginPage!.errorMessage
    ).toBeVisible();
  }
);