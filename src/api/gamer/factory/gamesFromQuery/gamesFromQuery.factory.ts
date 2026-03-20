import type { GamesQueryDto } from '../../dto/games-query.dto.js';
import { paginationFromQueryFactory } from '../paginationFromQuery/paginationFromQuery.factory.js';

/** Ordenação RAWG quando há texto de busca: maior rating primeiro ≈ títulos mais populares/relevantes. */
const DEFAULT_SEARCH_ORDERING = '-rating';

export function gamesFromQueryFactory(q: GamesQueryDto) {
  const base = paginationFromQueryFactory(q);
  const search = q.search?.trim() || undefined;
  const ordering =
    q.ordering?.trim() || (search ? DEFAULT_SEARCH_ORDERING : undefined);
  return {
    ...base,
    search,
    ordering,
  };
}
