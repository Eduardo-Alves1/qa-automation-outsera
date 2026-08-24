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