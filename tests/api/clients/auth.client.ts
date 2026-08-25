import { APIRequestContext, APIResponse } from '@playwright/test';
import { AuthRequest } from '../models/auth.model';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async createAuthToken(authData: Partial<AuthRequest>): Promise<APIResponse> {
    return this.request.post('/auth', {
      data: authData
    });
  }
}