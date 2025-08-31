import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { CreateRoleDto } from "../dto/create-role.dto";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { Permission } from "./permissions.entity";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  @PrimaryColumn({ type: "varchar", length: 36 })
  id: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  name: string;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ type: "varchar", length: 255 })
  notes: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @OneToMany(() => Permission, (permission) => permission.role, {
    cascade: true,
    eager: true,
  })
  permissions: Permission[];

  public fromDto(dto: CreateRoleDto | UpdateRoleDto): void {
    this.name = dto.name;
    this.notes = dto.notes || "";
    this.isActive = dto.isActive;

    this.permissions = dto.permissions?.map((permission) => {
      const p = new Permission();
      p.fromDto(permission);

      return p;
    });
  }
}
