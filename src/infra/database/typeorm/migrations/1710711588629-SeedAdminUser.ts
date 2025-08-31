import { hashSync } from "bcrypt";
import { randomUUID } from "crypto";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAdminUser1710711588629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const role = {
      id: randomUUID(),
      name: "admin",
      is_active: true,
      notes: "Administrator role",
      permissions: [
        {
          id: randomUUID(),
          name: "users",
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        {
          id: randomUUID(),
          name: "roles",
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      ],
    };

    await queryRunner.query(
      `INSERT INTO roles (id, name, is_active, notes) VALUES (?, ?, ?, ?)`,
      [role.id, role.name, role.is_active, role.notes],
    );
    await queryRunner.query(
      `INSERT INTO permissions (id, name, \`create\`, \`read\`, \`update\`, \`delete\`, roleId) VALUES ${role.permissions.map(() => `(?, ?, ?, ?, ?, ?, ?)`).join(",")}`,
      role.permissions.flatMap((permission) => [
        permission.id,
        permission.name,
        permission.create,
        permission.read,
        permission.update,
        permission.delete,
        role.id,
      ]),
    );

    const user = {
      id: randomUUID(),
      name: "admin",
      email: "admin@mail.com",
      password: hashSync("12345678", 10),
      role_id: role.id,
    };
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, role_id) VALUES (?, ?, ?, ?, ?)`,
      [user.id, user.name, user.email, user.password, user.role_id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE email = 'admin@mail.com'`);
    await queryRunner.query(
      `DELETE FROM permissions WHERE name IN ('users', 'roles')`,
    );
    await queryRunner.query(`DELETE FROM roles WHERE name = 'admin'`);

    await queryRunner.commitTransaction();
  }
}
