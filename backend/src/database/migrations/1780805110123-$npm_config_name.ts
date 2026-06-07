import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1780805110123 implements MigrationInterface {
    name = ' $npmConfigName1780805110123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "originalName" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" bigint NOT NULL, "s3Key" character varying NOT NULL, "s3Bucket" character varying NOT NULL, "isOrphan" boolean NOT NULL DEFAULT false, "taskId" uuid, "uploadedById" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_attachments_is_orphan" ON "attachment"  ("isOrphan") `);
        await queryRunner.query(`CREATE INDEX "idx_attachments_uploaded_by" ON "attachment"  ("uploadedById") `);
        await queryRunner.query(`CREATE INDEX "idx_attachments_task" ON "attachment"  ("taskId") `);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "taskId" uuid, "authorId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_comments_created_at" ON "comment"  ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_comments_author" ON "comment"  ("authorId") `);
        await queryRunner.query(`CREATE INDEX "idx_comments_task" ON "comment"  ("taskId") `);
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying(7) NOT NULL DEFAULT '#000000', CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'DONE', 'BACKLOG', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO', "dueDate" TIMESTAMP, "projectId" uuid, "assigneeId" uuid, "parentTaskId" uuid, "metadata" jsonb NOT NULL DEFAULT '{}', "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_tasks_due_date" ON "tasks"  ("dueDate") `);
        await queryRunner.query(`CREATE INDEX "idx_tasks_assignee" ON "tasks"  ("assigneeId") `);
        await queryRunner.query(`CREATE INDEX "idx_tasks_project_status" ON "tasks"  ("projectId", "status") `);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "tenantId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" uuid NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_projects_owner" ON "projects"  ("ownerId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "tenantId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."audit_log_action_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE')`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityName" character varying NOT NULL, "entityId" character varying NOT NULL, "action" "public"."audit_log_action_enum" NOT NULL, "oldValues" jsonb, "newValues" jsonb, "userId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_audit_log_created_at" ON "audit_log"  ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_audit_log_action" ON "audit_log"  ("action") `);
        await queryRunner.query(`CREATE INDEX "idx_audit_log_user" ON "audit_log"  ("userId") `);
        await queryRunner.query(`CREATE INDEX "idx_audit_log_entity" ON "audit_log"  ("entityName", "entityId") `);
        await queryRunner.query(`CREATE TABLE "tasks_tags_tag" ("tasksId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_f85294648ceb605a0f5fa01fb5d" PRIMARY KEY ("tasksId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e956bf1e5f84518b9979bd1792" ON "tasks_tags_tag"  ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19bda941e254f4579123f4a1e8" ON "tasks_tags_tag"  ("tagId") `);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attachment" ADD CONSTRAINT "FK_53bee183febd17739e30539bebe" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9a16d2c86252529f622fa53f1e3" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_34701b0b8d466af308ba202e4ef" FOREIGN KEY ("parentTaskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" ADD CONSTRAINT "FK_e956bf1e5f84518b9979bd17922" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" ADD CONSTRAINT "FK_19bda941e254f4579123f4a1e8e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" DROP CONSTRAINT "FK_19bda941e254f4579123f4a1e8e"`);
        await queryRunner.query(`ALTER TABLE "tasks_tags_tag" DROP CONSTRAINT "FK_e956bf1e5f84518b9979bd17922"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_34701b0b8d466af308ba202e4ef"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9a16d2c86252529f622fa53f1e3"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "FK_53bee183febd17739e30539bebe"`);
        await queryRunner.query(`ALTER TABLE "attachment" DROP CONSTRAINT "FK_611282e10752b2ecbd5c8525ab5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19bda941e254f4579123f4a1e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e956bf1e5f84518b9979bd1792"`);
        await queryRunner.query(`DROP TABLE "tasks_tags_tag"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_log_entity"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_log_user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_log_action"`);
        await queryRunner.query(`DROP INDEX "public"."idx_audit_log_created_at"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TYPE "public"."audit_log_action_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_projects_owner"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tasks_project_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tasks_assignee"`);
        await queryRunner.query(`DROP INDEX "public"."idx_tasks_due_date"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP INDEX "public"."idx_comments_task"`);
        await queryRunner.query(`DROP INDEX "public"."idx_comments_author"`);
        await queryRunner.query(`DROP INDEX "public"."idx_comments_created_at"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP INDEX "public"."idx_attachments_task"`);
        await queryRunner.query(`DROP INDEX "public"."idx_attachments_uploaded_by"`);
        await queryRunner.query(`DROP INDEX "public"."idx_attachments_is_orphan"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
    }

}
