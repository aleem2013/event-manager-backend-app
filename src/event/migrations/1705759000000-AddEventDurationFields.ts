import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventDurationFields1705759000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add columns with default values
        await queryRunner.query(`
            ALTER TABLE "event" 
            ADD COLUMN IF NOT EXISTS "numberOfDays" integer NOT NULL DEFAULT 1,
            ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);

        // Update endDate for existing records to be 1 day after startDate
        await queryRunner.query(`
            UPDATE "event" 
            SET "endDate" = "startDate" + interval '1 day'
            WHERE "endDate" = "startDate"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "event" 
            DROP COLUMN IF EXISTS "numberOfDays",
            DROP COLUMN IF EXISTS "startDate",
            DROP COLUMN IF EXISTS "endDate"
        `);
    }
}