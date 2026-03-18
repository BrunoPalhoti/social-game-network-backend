import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JourneyGameGenre } from "./JourneyGameGenre";

@Entity({ name: "genres" })
export class Genre {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Index({ unique: true })
  @Column({ type: "text" })
  name!: string;

  @OneToMany(() => JourneyGameGenre, (jgg) => jgg.genre)
  journeyGameGenres?: JourneyGameGenre[];
}

