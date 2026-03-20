import { HttpException, Injectable } from '@nestjs/common';
import { normalizeUsername } from '../auth/factory/normalizeUsername/normalizeUsername.factory.js';
import type { UpdateUserProfileDto } from './dto/update-user-profile.dto.js';
import { bannerPositionToDb } from './factory/bannerPositionToDb/bannerPositionToDb.factory.js';
import { normalizePlatformSelections } from './factory/normalizePlatformSelections/normalizePlatformSelections.factory.js';
import { userProfileResponseFromEntity } from './factory/userProfileResponseFromEntity/userProfileResponseFromEntity.factory.js';
import { UsersRepository } from './users.repository.js';
import type { UserProfileResponse } from './types/users.types.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async getUserOrThrow(username: string) {
    const user = await this.usersRepository.findUserWithPlatforms(
      normalizeUsername(username),
    );
    if (!user) throw new HttpException('Usuário não encontrado.', 404);
    return user;
  }

  async getProfile(username: string): Promise<UserProfileResponse> {
    const user = await this.getUserOrThrow(username);
    return userProfileResponseFromEntity(user);
  }

  async updateProfile(
    username: string,
    updates: UpdateUserProfileDto,
  ): Promise<void> {
    const user = await this.getUserOrThrow(username);

    if (updates.favoriteGame !== undefined)
      user.favoriteGameName = updates.favoriteGame ?? null;
    if (updates.favoriteGameCover !== undefined)
      user.favoriteGameCover = updates.favoriteGameCover ?? null;
    if (updates.favoriteGenre !== undefined)
      user.favoriteGenreName = updates.favoriteGenre ?? null;
    if (updates.favoriteGenreCover !== undefined)
      user.favoriteGenreCover = updates.favoriteGenreCover ?? null;
    if (updates.avatarUrl !== undefined)
      user.avatarUrl = updates.avatarUrl ?? null;
    if (updates.bannerUrl !== undefined)
      user.bannerUrl = updates.bannerUrl ?? null;
    if (updates.bannerPosition !== undefined) {
      user.bannerPosition = bannerPositionToDb(updates.bannerPosition);
    }

    if (updates.platforms !== undefined) {
      const normalized = normalizePlatformSelections(updates.platforms);
      await this.usersRepository.replaceUserPlatforms(user.id, normalized);
    }

    await this.usersRepository.saveUser(user);
  }
}
