import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUsersAddAttacmentRelation1731274387022
  implements MigrationInterface
{
  name = "AlterTableUsersAddAttacmentRelation1731274387022";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`picture_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_de8e1c40b790611c86b3e674de6\` FOREIGN KEY (\`picture_id\`) REFERENCES \`attachments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_de8e1c40b790611c86b3e674de6\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`picture_id\``);
  }
}
