import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from 'src/modules/roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 14,
  })
  document: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  password?: string | null;

  @Column({ type: 'varchar', length: 255, default: '', select: false })
  notes: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt?: Date;

  @ManyToOne(() => Role, {eager: true})
  @JoinColumn({ name: 'role_id',  })
  role: Role;

  public fromDto(dto: CreateUserDto | UpdateUserDto): void {
    this.name = dto.name;
    this.notes = dto.notes || '';
    this.isActive = dto.isActive;
    this.email = dto.email;
    this.document = dto.document.replace(/[^0-9]/g, '');

    if ('password' in dto && dto.password !== null) {
      this.password = dto.password  ;
    }
  }

  public toDto(): UpdateUserDto {
    return {
      name: this.name,
      notes: this.notes,
      isActive: this.isActive,
      email: this.email,
      document: this.document,
      role: {
        id: this.role.id,
        name: this.role.name,
      },
    };
  }
}
