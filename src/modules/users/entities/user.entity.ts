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
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

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
  }
}
