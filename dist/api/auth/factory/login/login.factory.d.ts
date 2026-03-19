import type { LoginDto } from '../../dto/login.dto.js';
export declare function loginFactory(payload: LoginDto): {
    username: string;
    password: string;
};
