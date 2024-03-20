import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    DeleteDateColumn,
    ManyToOne,
} from 'typeorm';
import { RolePermissionName, RolePermissionNameEnum } from 'src/types/roles/role-permission';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id: string;

    @Column({
        type: 'enum',
        enum: RolePermissionNameEnum,
    })
    name: RolePermissionName;

    @Column({ type: 'boolean', default: false, nullable: true })
    create: boolean | null;

    @Column({ type: 'boolean', default: false, nullable: true })
    read: boolean | null;

    @Column({ type: 'boolean', default: false, nullable: true })
    update: boolean | null;

    @Column({ type: 'boolean', default: false, nullable: true })
    delete: boolean | null;

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

    @ManyToOne(() => Role, (role) => role.permissions)
    role: Role;

    public fromDto(dto: CreatePermissionDto | UpdatePermissionDto): void {
        this.name = dto.name;
        this.create = dto.create;
        this.read = dto.read;
        this.update = dto.update;
        this.delete = dto.delete;
    }
}
