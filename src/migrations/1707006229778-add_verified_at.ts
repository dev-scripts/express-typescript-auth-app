import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedAt1707006229778 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users_1 
        ADD COLUMN verified_at TIMESTAMP AFTER active;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users_1 DROP COLUMN verified_at`)
    }
}