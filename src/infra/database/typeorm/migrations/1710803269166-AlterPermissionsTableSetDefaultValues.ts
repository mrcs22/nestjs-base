import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterPermissionsTableSetDefaultValues1710803269166
  implements MigrationInterface
{
  name = "AlterPermissionsTableSetDefaultValues1710803269166";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`create\` \`create\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`read\` \`read\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`update\` \`update\` tinyint NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`delete\` \`delete\` tinyint NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`delete\` \`delete\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`update\` \`update\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`read\` \`read\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`create\` \`create\` tinyint NOT NULL DEFAULT '0'`,
    );
  }
}
