import {
  //Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Create$Entity$Dto } from '../dto/create$Entity$.dto';
import { Update$Entity$Dto } from '../dto/update$Entity$.dto';

//@Entity()
export class $Entity$ {
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

  @Column({ type: 'varchar', length: 255 })
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

  public fromDto(dto: Create$Entity$Dto | Update$Entity$Dto): void {
    this.name = dto.name;
    this.notes = dto.notes || '';
    this.isActive = dto.isActive;
  }
}
