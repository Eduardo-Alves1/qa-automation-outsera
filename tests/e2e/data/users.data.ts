export const e2eUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  invalid: {
    username: 'invalid_user',
    password: 'invalid_password'
  }
} as const;

export const checkoutData = {
  valid: {
    firstName: 'Eduardo',
    lastName: 'Alves',
    postalCode: '06800-000'
  }
} as const;

export const products = {
  backpack: 'sauce-labs-backpack'
} as const;
