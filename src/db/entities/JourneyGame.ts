import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { JourneyStatus } from "../journey-status.enum";
import { Genre } from "./Genre";
import { User } from "./User";
import { JourneyGameGenre } from "./JourneyGameGenre";
import { Platform } from "./Platform";

@Entity({ name: "journey_games" })
@Index(["userId", "monthKey"])
@Index(["userId", "status"])
@Unique(["userId", "monthKey", "rawgGameId"])
export class JourneyGame {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "uuid", name: "user_id" })
  userId!: string;

  @ManyToOne(() => User, (u) => u.journeyGames, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @Column({ type: "text", name: "rawg_game_id" })
  rawgGameId!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", name: "cover_image_url", nullable: true })
  coverImageUrl?: string | null;

  @Column({
    type: "enum",
    enum: JourneyStatus,
    enumName: "journey_status",
    name: "status",
  })
  status!: JourneyStatus;

  @Column({ type: "date", name: "started_at", nullable: true })
  startedAt?: string | null;

  @Column({ type: "date", name: "completed_at", nullable: true })
  completedAt?: string | null;

  @Column({ type: "date", name: "dropped_at", nullable: true })
  droppedAt?: string | null;

  @Column({ type: "integer", name: "hours_played", nullable: true })
  hoursPlayed?: number | null;

  @Column({ type: "numeric", precision: 4, scale: 2, name: "rating", nullable: true })
  rating?: string | number | null;

  @Column({ type: "bigint", name: "platform_id", nullable: true })
  platformId?: number | null;

  @ManyToOne(() => Platform, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "platform_id" })
  platform?: Platform | null;

  @Column({ type: "char", length: 7, name: "month_key" })
  monthKey!: string;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Column({ type: "text", nullable: true })
  verdict?: string | null;

  @Column({ type: "boolean", name: "is_100_percent", nullable: true })
  is100Percent?: boolean | null;

  @Column({ type: "text", name: "dropped_reason", nullable: true })
  droppedReason?: string | null;

  @Column({ type: "date", name: "release_date", nullable: true })
  releaseDate?: string | null;

  @Column({ type: "boolean", name: "has_demo", nullable: true })
  hasDemo?: boolean | null;

  @OneToMany(() => JourneyGameGenre, (jgg) => jgg.journeyGame)
  journeyGameGenres?: JourneyGameGenre[];

  // Para ajudar o TypeORM nas migrations/relation, mantemos o tipo.
  // (As colunas de relation são definidas no JourneyGameGenre.)
  genres?: Genre[];

  // Coluna status default fica a cargo do cliente/seed.
}

