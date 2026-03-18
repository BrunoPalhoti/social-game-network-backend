import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SeedMockUsers1710000000001 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(_queryRunner: QueryRunner): Promise<void>;
}
