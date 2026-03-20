import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async countUsersByUsernameOrEmail(username: string, email: string) {
    return this.usersRepo.count({
      where: [{ username }, { email }],
    });
  }

  async createUser(input: {
    username: string;
    email: string;
    passwordHash: string;
    name: string;
    nickname: string;
  }): Promise<User> {
    const user = this.usersRepo.create({
      id: randomUUID(),
      username: input.username,
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
      nickname: input.nickname,
      createdAt: new Date(),
    });

    return this.usersRepo.save(user);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { id },
    });
  }

  async findUserWithPlatformsByUsername(
    username: string,
  ): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { username },
      relations: ['userPlatforms', 'userPlatforms.platform'],
    });
  }

  async findAllUsersWithPlatformsOrdered(): Promise<User[]> {
    return this.usersRepo.find({
      relations: ['userPlatforms', 'userPlatforms.platform'],
      order: { createdAt: 'ASC' },
    });
  }
}
