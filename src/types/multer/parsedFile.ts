import { environmentVariables } from 'src/config/environmentVariables';
import { deleteFile } from 'src/utils/helpers/deleteFile';

class ParsedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
  fileUrl: string;

  public fromFile(file: Express.Multer.File) {
    this.fieldname = file.fieldname;
    this.originalname = file.originalname;
    this.mimetype = file.mimetype;
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

  public delete() {
    deleteFile(this.path);
  }
}

const iterableAllowedFileMimes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'application/xml',
] as const;

type AllowedFileMime = (typeof iterableAllowedFileMimes)[number];

export { AllowedFileMime, ParsedFile, iterableAllowedFileMimes };
