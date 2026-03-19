import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entities/User';
import { Platform } from '../../db/entities/Platform';
import { UserPlatform } from '../../db/entities/UserPlatform';

type PlatformSelection = { name: string; imageUrl: string | null };

type UserProfileResponse = {
  username: string;
  name: string;
  nickname: string;
  platforms?: PlatformSelection[];
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
};

export class UpdateUserProfileDto {
  favoriteGame?: string;
  favoriteGameCover?: string;
  favoriteGenre?: string;
  favoriteGenreCover?: string;
  platforms?: PlatformSelection[];
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bannerPosition?: 'top' | 'center' | 'bottom' | number;
}

export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Platform)
    private readonly platformsRepo: Repository<Platform>,
    @InjectRepository(UserPlatform)
    private readonly userPlatformsRepo: Repository<UserPlatform>,
  ) {}

  private normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
  }

  private toBannerPosition(
    bannerPosition?: 'top' | 'center' | 'bottom' | number,
  ): string | null {
    if (bannerPosition === undefined) return null;
    if (typeof bannerPosition === 'number') {
      return Number.isFinite(bannerPosition)
        ? String(Math.round(bannerPosition))
        : null;
    }
    return bannerPosition;
  }

  private async getUserOrThrow(username: string): Promise<User> {
    const norm = this.normalizeUsername(username);
    const user = await this.usersRepo.findOne({
      where: { username: norm },
      relations: ['userPlatforms', 'userPlatforms.platform'],
    });
    if (!user) throw new HttpException('Usuário não encontrado.', 404);
    return user;
  }

  private toProfileResponse(user: User): UserProfileResponse {
    const platforms = (user.userPlatforms ?? [])
      .map((up) => up.platform)
      .filter((p): p is Platform => !!p)
      .map((p) => ({ name: p.name, imageUrl: p.imageUrl ?? null }));

    return {
      username: user.username,
      name: user.name,
      nickname: user.nickname,
      platforms: platforms.length > 0 ? platforms : undefined,
      favoriteGame: user.favoriteGameName ?? undefined,
      favoriteGameCover: user.favoriteGameCover ?? undefined,
      favoriteGenre: user.favoriteGenreName ?? undefined,
      favoriteGenreCover: user.favoriteGenreCover ?? undefined,
      avatarUrl: user.avatarUrl ?? null,
      bannerUrl: user.bannerUrl ?? null,
      bannerPosition:
        user.bannerPosition === null || user.bannerPosition === undefined
          ? 'center'
          : // "top|center|bottom" ou "0-100"
            user.bannerPosition === 'top' ||
              user.bannerPosition === 'center' ||
              user.bannerPosition === 'bottom'
            ? user.bannerPosition
            : Number.isFinite(Number(user.bannerPosition))
              ? Number(user.bannerPosition)
              : 'center',
    };
  }

  async getProfile(username: string): Promise<UserProfileResponse> {
    const user = await this.getUserOrThrow(username);
    return this.toProfileResponse(user);
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
      user.bannerPosition = this.toBannerPosition(updates.bannerPosition);
    }

    // Recria a lista de plataformas do usuário
    if (updates.platforms !== undefined) {
      await this.userPlatformsRepo.delete({ userId: user.id });

      const normalized = (updates.platforms ?? [])
        .map((p) => ({ name: p.name.trim(), imageUrl: p.imageUrl ?? null }))
        .filter((p) => !!p.name);

      for (const p of normalized) {
        const platform = await this.platformsRepo.findOne({
          where: { name: p.name },
        });
        const platformEntity = platform
          ? platform
          : await this.platformsRepo.save(
              this.platformsRepo.create({
                name: p.name,
                imageUrl: p.imageUrl,
              }),
            );
        await this.userPlatformsRepo.save(
          this.userPlatformsRepo.create({
            userId: user.id,
            platformId: platformEntity.id,
          }),
        );
      }
    }

    await this.usersRepo.save(user);
  }
}

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.usersService.getProfile(username);
  }

  @Patch(':username/profile')
  updateProfile(
    @Param('username') username: string,
    @Body() body: UpdateUserProfileDto,
  ) {
    return this.usersService.updateProfile(username, body);
  }
}
