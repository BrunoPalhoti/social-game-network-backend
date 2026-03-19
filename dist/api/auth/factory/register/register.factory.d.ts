import type { RegisterDto } from '../../dto/register.dto.js';
export declare function registerFactory(payload: RegisterDto): {
    username: string;
    email: string;
    password: string;
};
