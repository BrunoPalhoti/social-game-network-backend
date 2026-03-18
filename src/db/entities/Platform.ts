import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserPlatform } from "./UserPlatform";

@Entity({ name: "platforms" })
export class Platform {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Index({ unique: true })
  @Column({ type: "text" })
  name!: string;

  @Column({ type: "text", name: "image_url", nullable: true })
  imageUrl?: string | null;

  @OneToMany(() => UserPlatform, (up) => up.platform)
  userPlatforms?: UserPlatform[];
}

