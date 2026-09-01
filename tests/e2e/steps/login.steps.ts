import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { environmentConfig } from '../../../config/environments';
import { E2EWorld } from '../support/world';
import { e2eUsers } from '../data/users.data';

async function expectLoginPage(world: E2EWorld): Promise<void> {
  await expect(world.page!).not.toHaveURL(/inventory\.html/);
  await expect(world.loginPage!.loginLogo).toHaveText('Swag Labs');
  await expect(world.loginPage!.usernameInput).toBeVisible();
  await expect(world.loginPage!.passwordInput).toBeVisible();
  await expect(world.loginPage!.loginButton).toBeVisible();
}

Given(
  'que o usuário está na página de login do SauceDemo',
  async function (this: E2EWorld) {
    await this.loginPage!.open(environmentConfig.e2e.baseUrl);
    await expectLoginPage(this);
  }
);

When(
  'o usuário realiza o login com credenciais válidas',
  async function (this: E2EWorld) {
    await this.loginPage!.login(
      e2eUsers.standard.username,
      e2eUsers.standard.password
    );
  }
);

Then(
  'a página de produtos deve ser exibida',
  async function (this: E2EWorld) {
    await expect(this.page!).toHaveURL(/\/inventory\.html$/);
    await expect(this.inventoryPage!.title).toHaveText('Products');
    await expect(this.inventoryPage!.inventoryList).toBeVisible();
    await expect(this.inventoryPage!.cartLink).toBeVisible();
    await expect(this.loginPage!.loginButton).toBeHidden();
  }
);

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
    await expectLoginPage(this);
    await expect(this.loginPage!.errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  }
);

When(
  'o usuário tenta realizar o login sem informar {string}',
  async function (this: E2EWorld, field: string) {
    const username = field === 'usuário'
      ? ''
      : e2eUsers.standard.username;

    const password = field === 'senha'
      ? ''
      : e2eUsers.standard.password;

    await this.loginPage!.login(username, password);
  }
);

Then(
  'a mensagem de validação de login {string} deve ser exibida',
  async function (this: E2EWorld, message: string) {
    await expectLoginPage(this);
    await expect(this.loginPage!.errorMessage).toHaveText(message);
  }
);

When(
  'o usuário tenta realizar o login com um usuário bloqueado',
  async function (this: E2EWorld) {
    await this.loginPage!.login(
      e2eUsers.locked.username,
      e2eUsers.locked.password
    );
  }
);

Then(
  'uma mensagem informando que o usuário está bloqueado deve ser exibida',
  async function (this: E2EWorld) {
    await expectLoginPage(this);
    await expect(this.loginPage!.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  }
);
