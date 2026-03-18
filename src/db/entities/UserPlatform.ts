import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Platform } from "./Platform";
import { User } from "./User";

@Entity({ name: "user_platforms" })
export class UserPlatform {
  @PrimaryColumn({ type: "uuid", name: "user_id" })
  userId!: string;

  @PrimaryColumn({ type: "bigint", name: "platform_id" })
  platformId!: number;

  @ManyToOne(() => User, (u) => u.userPlatforms, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToOne(() => Platform, (p) => p.userPlatforms, { onDelete: "CASCADE" })
  @JoinColumn({ name: "platform_id" })
  platform?: Platform;
}

