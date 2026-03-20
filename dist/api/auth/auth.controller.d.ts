import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: RegisterDto): Promise<{
        username: string;
    }>;
    login(body: LoginDto): Promise<{
        user: import("./types/auth.types.js").AuthUserSnapshot;
    }>;
    getUsersForAuth(): Promise<Record<string, import("./types/auth.types.js").AuthUserSnapshot>>;
    getUserById(id: string): Promise<import("../../db/entities/User.js").User | null>;
}
