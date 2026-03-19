import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
export declare class AuthRepository {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    countUsersByUsernameOrEmail(username: string, email: string): Promise<number>;
    createUser(input: {
        username: string;
        email: string;
        passwordHash: string;
        name: string;
        nickname: string;
    }): Promise<User>;
    findUserWithPlatformsByUsername(username: string): Promise<User | null>;
    findAllUsersWithPlatformsOrdered(): Promise<User[]>;
}
