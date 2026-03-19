import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { AuthUserSnapshot } from './types/auth.types.js';
import { AuthRepository } from './auth.repository.js';
export declare class AuthService {
    private readonly authRepository;
    constructor(authRepository: AuthRepository);
    register(payload: RegisterDto): Promise<{
        username: string;
    }>;
    login(payload: LoginDto): Promise<{
        user: AuthUserSnapshot;
    }>;
    getUsersForAuth(): Promise<Record<string, AuthUserSnapshot>>;
}
