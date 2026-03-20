import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { AuthUserSnapshot } from './types/auth.types.js';
import { AuthRepository } from './auth.repository.js';
import { registerFactory } from './factory/register/register.factory.js';
import { loginFactory } from './factory/login/login.factory.js';
import { getUsersForAuthFactory } from './factory/getUsersForAuth/getUsersForAuth.factory.js';
import { toAuthSnapshotFromUser } from './factory/toAuthSnapshotFromUser/toAuthSnapshotFromUser.factory.js';
import { hashPassword, verifyPassword } from './password.js';
import { User } from 'src/db/entities/User.js';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(payload: RegisterDto): Promise<{ username: string }> {
    const { username, email, password } = registerFactory(payload);

    if (!username || !email || !password) {
      throw new HttpException('Dados inválidos.', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.authRepository.countUsersByUsernameOrEmail(
      username,
      email,
    );
    if (exists > 0) {
      throw new HttpException(
        'Username ou e-mail já cadastrado.',
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await hashPassword(password);
    await this.authRepository.createUser({
      username,
      email,
      passwordHash,
      name: username,
      nickname: username,
    });
    return { username };
  }

  async login(payload: LoginDto): Promise<{ user: AuthUserSnapshot }> {
    const { username, password } = loginFactory(payload);

    const user =
      await this.authRepository.findUserWithPlatformsByUsername(username);
    if (!user) {
      throw new HttpException('Usuário ou senha inválidos.', 401);
    }

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) {
      throw new HttpException('Usuário ou senha inválidos.', 401);
    }

    const snapshot = toAuthSnapshotFromUser(user);
    return { user: snapshot };
  }

  async getUsersForAuth(): Promise<Record<string, AuthUserSnapshot>> {
    const users = await this.authRepository.findAllUsersWithPlatformsOrdered();
    return getUsersForAuthFactory(users);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.authRepository.findUserById(id);
  }
}
