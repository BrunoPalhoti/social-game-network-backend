import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { UserPlatform } from '../../db/entities/UserPlatform';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Platform)
    private readonly platformsRepo: Repository<Platform>,
    @InjectRepository(UserPlatform)
    private readonly userPlatformsRepo: Repository<UserPlatform>,
  ) {}

  findUserWithPlatforms(normalizedUsername: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { username: normalizedUsername },
      relations: ['userPlatforms', 'userPlatforms.platform'],
    });
  }

  saveUser(user: User): Promise<User> {
    return this.usersRepo.save(user);
  }

  async replaceUserPlatforms(
    userId: string,
    platforms: { name: string; imageUrl: string | null }[],
  ): Promise<void> {
    await this.userPlatformsRepo.delete({ userId });

    for (const p of platforms) {
      const existing = await this.platformsRepo.findOne({
        where: { name: p.name },
      });
      const platformEntity = existing
        ? existing
        : await this.platformsRepo.save(
            this.platformsRepo.create({
              name: p.name,
              imageUrl: p.imageUrl,
            }),
          );
      await this.userPlatformsRepo.save(
        this.userPlatformsRepo.create({
          userId,
          platformId: platformEntity.id,
        }),
      );
    }
  }
}
