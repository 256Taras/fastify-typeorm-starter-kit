export default class CreateUserAndAuthToken1688942208884 {
  name = "CreateUserAndAuthToken1688942208884";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "auth_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ppid" character varying(255) NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id")); COMMENT ON COLUMN "auth_token"."id" IS 'Token ID'; COMMENT ON COLUMN "auth_token"."ppid" IS 'PPID'; COMMENT ON COLUMN "auth_token"."user_id" IS 'User ID'; COMMENT ON COLUMN "auth_token"."created_at" IS 'Timestamp of creation'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "roles" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_token" ADD CONSTRAINT "FK_26b580c89e141c75426f44317bc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "query-result-cache"`);
    await queryRunner.query(`ALTER TABLE "auth_token" DROP CONSTRAINT "FK_26b580c89e141c75426f44317bc"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "auth_token"`);
  }
}
