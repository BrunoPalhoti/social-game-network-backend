import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JourneyGame } from "./JourneyGame";
import { UserPlatform } from "./UserPlatform";
import { JourneyGameGenre } from "./JourneyGameGenre";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index({ unique: true })
  @Column({ type: "text" })
  username!: string;

  @Index({ unique: true })
  @Column({ type: "text" })
  email!: string;

  @Column({ type: "text", name: "password_hash" })
  passwordHash!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text" })
  nickname!: string;

  @Column({ type: "timestamptz", name: "created_at", default: () => "now()" })
  createdAt!: Date;

  @Column({ type: "text", name: "avatar_url", nullable: true })
  avatarUrl?: string | null;

  @Column({ type: "text", name: "banner_url", nullable: true })
  bannerUrl?: string | null;

  @Column({ type: "text", name: "banner_position", nullable: true })
  bannerPosition?: string | null;

  @Column({ type: "text", name: "favorite_game_name", nullable: true })
  favoriteGameName?: string | null;

  @Column({ type: "text", name: "favorite_game_cover", nullable: true })
  favoriteGameCover?: string | null;

  @Column({ type: "text", name: "favorite_genre_name", nullable: true })
  favoriteGenreName?: string | null;

  @Column({ type: "text", name: "favorite_genre_cover", nullable: true })
  favoriteGenreCover?: string | null;

  // Relações (mantidas aqui para permitir futuras queries/repositórios)
  // Como TypeORM aceita lazy typing com type-only imports, evitamos import circular.
  @OneToMany(() => UserPlatform, (up) => up.user)
  userPlatforms?: UserPlatform[];

  @OneToMany(() => JourneyGame, (jg) => jg.user)
  journeyGames?: JourneyGame[];
}

