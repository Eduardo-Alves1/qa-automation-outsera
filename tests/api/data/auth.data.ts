import { environmentConfig } from '../../../config/environments';
import type { AuthRequest } from '../models/auth.model';

export function createValidAuthData(): AuthRequest {
  return {
    ...environmentConfig.api.credentials
  };
}

export function createInvalidAuthData(): AuthRequest {
  const suffix = Date.now();

  return {
    username: `invalid-user-${suffix}`,
    password: `invalid-password-${suffix}`
  };
}

export function createAuthDataWithoutUsername(): Partial<AuthRequest> {
  return {
    password: environmentConfig.api.credentials.password
  };
}

export function createAuthDataWithoutPassword(): Partial<AuthRequest> {
  return {
    username: environmentConfig.api.credentials.username
  };
}

export function createEmptyAuthData(): Partial<AuthRequest> {
  return {};
}
