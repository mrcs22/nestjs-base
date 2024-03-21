import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttachmentsTable1711046829386 implements MigrationInterface {
    name = 'CreateAttachmentsTable1711046829386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`attachments\` (\`id\` varchar(36) NOT NULL, \`fieldname\` varchar(255) NOT NULL, \`originalname\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`destination\` varchar(255) NOT NULL, \`filename\` varchar(255) NOT NULL, \`path\` varchar(255) NULL, \`size\` int NOT NULL, \`fileUrl\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`attachments\``);
    }

}
