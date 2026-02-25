import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771991371357 implements MigrationInterface {
    name = 'Init1771991371357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_session" ("id" character varying(20) NOT NULL, "title" character varying(20) NOT NULL, "session_id" character varying(36) NOT NULL, CONSTRAINT "PK_9017c2ee500cd1ba895752a0aa7" PRIMARY KEY ("id")); COMMENT ON COLUMN "chat_session"."title" IS '标题'; COMMENT ON COLUMN "chat_session"."session_id" IS '会话 ID'`);
        await queryRunner.query(`COMMENT ON TABLE "chat_session" IS '会话'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "chat_session" IS NULL`);
        await queryRunner.query(`DROP TABLE "chat_session"`);
    }

}
