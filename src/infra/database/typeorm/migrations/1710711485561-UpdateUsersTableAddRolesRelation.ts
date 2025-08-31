import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTableAddRolesRelation1710711485561
  implements MigrationInterface
{
  name = "UpdateUsersTableAddRolesRelation1710711485561";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`role_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role_id\``);
  }
}
