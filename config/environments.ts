import dotenv from 'dotenv';

dotenv.config();

export type TestEnvironment = 'dev' | 'hml' | 'qa';

type UserCredentials = {
  username: string;
  password: string;
};

type EnvironmentConfig = {
  api: {
    baseUrl: string;
    credentials: UserCredentials;
  };
  e2e: {
    baseUrl: string;
    standardUser: UserCredentials;
    lockedUser: UserCredentials;
  };
};

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não está configurada.`);
  }

  return value;
}

function createEnvironment(prefix: string): EnvironmentConfig {
  return {
    api: {
      baseUrl: required(`${prefix}_API_URL`),
      credentials: {
        username: required(`${prefix}_API_USERNAME`),
        password: required(`${prefix}_API_PASSWORD`)
      }
    },
    e2e: {
      baseUrl: required(`${prefix}_E2E_URL`),
      standardUser: {
        username: required(`${prefix}_E2E_STANDARD_USERNAME`),
        password: required(`${prefix}_E2E_STANDARD_PASSWORD`)
      },
      lockedUser: {
        username: required(`${prefix}_E2E_LOCKED_USERNAME`),
        password: required(`${prefix}_E2E_LOCKED_PASSWORD`)
      }
    }
  };
}

const selectedEnvironment = (process.env.TEST_ENV || 'dev').toLowerCase();

if (!['dev', 'hml', 'qa'].includes(selectedEnvironment)) {
  throw new Error(
    `TEST_ENV inválido: ${selectedEnvironment}. Use dev, hml ou qa.`
  );
}

export const testEnvironment = selectedEnvironment as TestEnvironment;

const environmentFactories: Record<
  TestEnvironment,
  () => EnvironmentConfig
> = {
  dev: () => createEnvironment('DEV'),
  hml: () => createEnvironment('HML'),
  qa: () => createEnvironment('QA')
};

export const environmentConfig = environmentFactories[testEnvironment]();
