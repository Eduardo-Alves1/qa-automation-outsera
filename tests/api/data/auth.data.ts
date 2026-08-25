import { AuthRequest } from "../models/auth.model";

export function createValidAuthData(): AuthRequest {
    return {
        username: 'admin',
        password: 'password123'
    };
}

export function createInvalidAuthData(): AuthRequest {
    return {
        username: 'invalidUser',
        password: 'wrongPassword'
    };
}

export function createAuthDataWithoutUsername(): Partial<AuthRequest> {
    return {
        password: 'password123'
    };
}

export function createAuthDataWithoutPassword(): Partial<AuthRequest> {
    return {
        username: 'admin'
    };
}

export function createEmptyAuthData(): Partial<AuthRequest> {
    return {};
}