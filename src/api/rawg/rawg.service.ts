import { Injectable } from '@nestjs/common';
import { RawgClient } from './rawg.client.js';
import type {
  RawgGame,
  RawgGamesResponse,
  RawgGenre,
  RawgPlatform,
} from './types/rawg.types.js';

@Injectable()
export class RawgService {
  constructor(private readonly rawgClient: RawgClient) {}

  games(params: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgGame>> {
    return this.rawgClient.games(params);
  }

  platforms(params: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgPlatform>> {
    return this.rawgClient.platforms(params);
  }

  genres(params: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<RawgGamesResponse<RawgGenre>> {
    return this.rawgClient.genres(params);
  }
}
