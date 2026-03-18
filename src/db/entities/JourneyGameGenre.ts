import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Genre } from "./Genre";
import { JourneyGame } from "./JourneyGame";

@Entity({ name: "journey_game_genres" })
export class JourneyGameGenre {
  @PrimaryColumn({ type: "bigint", name: "journey_game_id" })
  journeyGameId!: number;

  @PrimaryColumn({ type: "bigint", name: "genre_id" })
  genreId!: number;

  @ManyToOne(() => JourneyGame, (jg) => jg.journeyGameGenres, { onDelete: "CASCADE" })
  @JoinColumn({ name: "journey_game_id" })
  journeyGame?: JourneyGame;

  @ManyToOne(() => Genre, (g) => g.journeyGameGenres, { onDelete: "CASCADE" })
  @JoinColumn({ name: "genre_id" })
  genre?: Genre;
}

