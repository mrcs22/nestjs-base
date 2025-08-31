import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { Role } from "src/modules/roles/entities/role.entity";
import { Attachment } from "src/modules/attachments/entities/attachment.entity";
import { hashSync } from "bcrypt";

@Entity("users")
export class User {
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

  @Column({
    type: "varchar",
    length: 14,
  })
  document: string;

  @Column({
    type: "varchar",
    length: 255,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    select: false,
  })
  password?: string | null;

  @Column({ type: "varchar", length: 255, default: "", select: false })
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

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Attachment, { eager: true, nullable: true })
  @JoinColumn({ name: "picture_id" })
  picture?: Attachment | null;

  public fromDto(dto: CreateUserDto | UpdateUserDto): void {
    this.name = dto.data.name;
    this.notes = dto.data.notes || "";
    this.isActive = dto.data.isActive;
    this.email = dto.data.email;
    this.document = dto.data.document.replace(/[^0-9]/g, "");

    if (dto.picture === undefined) {
      this.picture = undefined
    }

    if ("password" in dto.data) {
      const password = dto.data.password

      if (password)
        this.password = hashSync(password, 10);
    }
  }

  public toDto(): UpdateUserDto {
    return {
      data: {
        name: this.name,
        notes: this.notes,
        isActive: this.isActive,
        email: this.email,
        document: this.document,
        role: {
          id: this.role.id,
          name: this.role.name,
        },
      },
    };
  }
}
