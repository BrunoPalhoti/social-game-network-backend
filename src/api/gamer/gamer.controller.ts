import {
  BadGatewayException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';

type RawgGamesResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type RawgGame = {
  id: number;
  name: string;
  slug: string;
  released?: string;
  background_image: string | null;
  rating: number;
  rating_top: number;
  metacritic?: number;
  playtime?: number;
  platforms?: Array<{ platform: { name: string } }>;
  genres?: Array<{ name: string }>;
};

type RawgPlatform = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_background?: string | null;
  games_count?: number;
};

type RawgGenre = {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string | null;
};

export class RawgProxyService {
  private readonly baseUrl = 'https://api.rawg.io/api';

  private getApiKey(): string {
    return (
      process.env.RAWG_API_KEY ??
      process.env.VITE_RAWG_API_KEY ??
      ''
    ).trim();
  }

  private async fetchRawg<T>(
    resource: string,
    params: Record<string, string | undefined>,
  ): Promise<T> {
    const searchParams = new URLSearchParams();
    const key = this.getApiKey();
    if (key) searchParams.set('key', key);

    for (const [k, v] of Object.entries(params)) {
      if (!v) continue;
      searchParams.set(k, v);
    }

    const url = `${this.baseUrl}/${resource}?${searchParams.toString()}`;

    let res: Response;
    try {
      res = await fetch(url);
    } catch {
      throw new BadGatewayException('Falha ao consultar RAWG.');
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new HttpException(
        `RAWG error: ${res.status} ${res.statusText} ${text}`.trim(),
        HttpStatus.BAD_GATEWAY,
      );
    }

    return (await res.json()) as T;
  }

  async games(params: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgGame>> {
    return this.fetchRawg<RawgGamesResponse<RawgGame>>('games', {
      page: String(params.page ?? 1),
      page_size: String(params.page_size ?? 12),
      search: params.search?.trim() || undefined,
      ordering: params.ordering,
    });
  }

  async platforms(params: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgPlatform>> {
    return this.fetchRawg<RawgGamesResponse<RawgPlatform>>('platforms', {
      page: String(params.page ?? 1),
      page_size: String(params.page_size ?? 20),
      ordering: params.ordering,
    });
  }

  async genres(params: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgGenre>> {
    return this.fetchRawg<RawgGamesResponse<RawgGenre>>('genres', {
      page: String(params.page ?? 1),
      page_size: String(params.page_size ?? 20),
      ordering: params.ordering,
    });
  }
}

@Controller('api/gamer')
export class GamerController {
  constructor(private readonly rawg: RawgProxyService) {}

  @Get('games')
  getGames(
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
    @Query('search') search?: string,
    @Query('ordering') ordering?: string,
  ) {
    const pageN = page ? Number(page) : undefined;
    const sizeN = pageSize ? Number(pageSize) : undefined;
    return this.rawg.games({ page: pageN, page_size: sizeN, search, ordering });
  }

  @Get('platforms')
  getPlatforms(
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
    @Query('ordering') ordering?: string,
  ) {
    const pageN = page ? Number(page) : undefined;
    const sizeN = pageSize ? Number(pageSize) : undefined;
    return this.rawg.platforms({ page: pageN, page_size: sizeN, ordering });
  }

  @Get('genres')
  getGenres(
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
    @Query('ordering') ordering?: string,
  ) {
    const pageN = page ? Number(page) : undefined;
    const sizeN = pageSize ? Number(pageSize) : undefined;
    return this.rawg.genres({ page: pageN, page_size: sizeN, ordering });
  }
}
