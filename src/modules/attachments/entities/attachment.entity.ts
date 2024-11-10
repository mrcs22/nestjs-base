import { environmentVariables } from 'src/config/environment-variables';
import { User } from 'src/modules/users/entities/user.entity';
import { deleteFile } from 'src/utils/helpers/delete-file';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    PrimaryColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';

export const iterableAllowedFileMimes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'application/xml',
] as const;

export type AllowedFileMime = (typeof iterableAllowedFileMimes)[number];

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    fieldname: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    originalname: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    mimetype: AllowedFileMime;

    @Column({
        type: 'varchar',
        length: 255,
    })
    destination: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    filename: string ;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    path: string | null;

    @Column({
        type: 'int',
    })
    size: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    fileUrl: string | null;

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

    @OneToMany(() => User, user => user.picture)
    users: User[]

    public fromFile(file: Express.Multer.File) {
        this.fieldname = file.fieldname;
        this.originalname = file.originalname;
        this.mimetype = file.mimetype as AllowedFileMime;
        this.destination = file.destination;
        this.filename = file.filename;
        this.path = file.path;
        this.size = file.size;

        if (environmentVariables.FILES_STORAGE_TYPE === 'local') {
            const [, relativePath] = file.path.split('files');
            this.fileUrl = `${environmentVariables.API_URL}/files/public${relativePath}`;
        }

        if (environmentVariables.FILES_STORAGE_TYPE === 'remote') {
            throw new Error('Remote storage not implemented');
        }
    }

    public isImage() {
        return (
            this.mimetype === 'image/jpeg' ||
            this.mimetype === 'image/pjpeg' ||
            this.mimetype === 'image/png'
        );
    }

    public isSpreadsheet() {
        return (
            this.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            this.mimetype === 'application/vnd.ms-excel'
        );
    }

    public deletePhysicalFile() {
        if(this.path)
        deleteFile(this.path);

        this.path = null;
        this.fileUrl = null;
    }
}
