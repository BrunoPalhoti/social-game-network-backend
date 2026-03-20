import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RAWG_API_DEFAULT_BASE } from './rawg.constants.js';
import type {
  RawgGame,
  RawgGamesResponse,
  RawgGenre,
  RawgPlatform,
} from './types/rawg.types.js';

@Injectable()
export class RawgClient {
  private readonly baseUrl =
    (process.env.RAWG_API_BASE_URL ?? '').trim() || RAWG_API_DEFAULT_BASE;

  private getApiKey(): string {
    return (
      process.env.RAWG_API_KEY ??
      process.env.VITE_RAWG_API_KEY ??
      ''
    ).trim();
  }

  private async request<T>(
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

    const url = `${this.baseUrl.replace(/\/$/, '')}/${resource}?${searchParams.toString()}`;

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
    return this.request<RawgGamesResponse<RawgGame>>('games', {
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
    return this.request<RawgGamesResponse<RawgPlatform>>('platforms', {
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
    return this.request<RawgGamesResponse<RawgGenre>>('genres', {
      page: String(params.page ?? 1),
      page_size: String(params.page_size ?? 20),
      ordering: params.ordering,
    });
  }
}
