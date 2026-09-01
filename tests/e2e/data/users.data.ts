import { environmentConfig } from '../../../config/environments';

export type CheckoutData = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export const e2eUsers = {
  standard: environmentConfig.e2e.standardUser,
  invalid: {
    username: `invalid-user-${Date.now()}`,
    password: `invalid-password-${Date.now()}`
  },
  locked: environmentConfig.e2e.lockedUser
} as const;

export function createCheckoutData(
  overrides: Partial<CheckoutData> = {}
): CheckoutData {
  const suffix = `${Date.now()}`.slice(-6);

  return {
    firstName: `Test${suffix}`,
    lastName: `User${suffix}`,
    postalCode: `0${suffix}`,
    ...overrides
  };
}

export const products = {
  backpack: {
    slug: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99
  }
} as const;
