import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { E2EWorld } from '../support/world';
import { e2eUsers } from '../data/users.data';

Given(
  'que o usuário está na página de login do SauceDemo',
  async function (this: E2EWorld) {
    const baseUrl = process.env.E2E_BASE_URL;

    if (!baseUrl) {
      throw new Error(
        'A variável E2E_BASE_URL não está configurada.'
      );
    }

    await this.loginPage!.open(baseUrl);
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
    await expect(
      this.inventoryPage!.title
    ).toHaveText('Products');
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
    await expect(
      this.loginPage!.errorMessage
    ).toBeVisible();
  }
);

When(
  'o usuário tenta realizar o login sem informar o usuário',
  async function (this: E2EWorld) {
    await this.loginPage!.login(
      '',
      e2eUsers.standard.password
    );
  }
);

Then(
  'uma mensagem informando que o usuário é obrigatório deve ser exibida',
  async function (this: E2EWorld) {
    await expect(
      this.loginPage!.errorMessage
    ).toHaveText('Epic sadface: Username is required');
  }
);

When(
  'o usuário tenta realizar o login sem informar a senha',
  async function (this: E2EWorld) {
    await this.loginPage!.login(
      e2eUsers.standard.username,
      ''
    );
  }
);

Then(
  'uma mensagem informando que a senha é obrigatória deve ser exibida',
  async function (this: E2EWorld) {
    await expect(
      this.loginPage!.errorMessage
    ).toHaveText('Epic sadface: Password is required');
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
    await expect(
      this.loginPage!.errorMessage
    ).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  }
);
