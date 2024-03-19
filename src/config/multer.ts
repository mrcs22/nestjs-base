import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';
import {
  AllowedFileMime,
  iterableAllowedFileMimes,
} from '../types/multer/parsedFile';
import { environmentVariables } from './environmentVariables';
import { megabytesToBytes } from '../utils/helpers/megabytesToBytes';
import { Request } from 'express';
import AppException from 'src/exceptionFilters/AppException/AppException';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const fileNameHandler = (
  _req: Request,
  file: Express.Multer.File,
  cb: (err: Error | null, destination: string) => void,
) => {
  const fileName = `${randomUUID()}-${file.originalname}`;

  cb(null, fileName);
};

const localDestinationHandler = (
  req: Request,
  _file: Express.Multer.File,
  cb: (err: Error | null, destination: string) => void,
) => {
  const routeName = req.url.split('/')?.[1];
  if (!routeName) throw new AppException('Rota não encontrada', 404);

  const folderPath = path.resolve(
    __dirname,
    '..',
    '..',
    'files',
    'upload',
    routeName,
  );

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  cb(null, folderPath);
};

const getLocalStorage = () => {
  return multer.diskStorage({
    destination: localDestinationHandler,
    filename: fileNameHandler,
  });
};

const getRemoteStorage = () => {
  throw new Error('Remote storage not implemented yet.');
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (err: Error | null, acceptFile: boolean) => void,
) => {
  if (iterableAllowedFileMimes.includes(file.mimetype as AllowedFileMime)) {
    cb(null, true);
  } else {
    cb(
      new AppException(
        'Formato de arquivo inválido. Os formatos permitidos são: .jpeg, .jpg .png, .docx, .pdf, .xlsx',
        400,
      ),
      false,
    );
  }
};

const multerConfig: MulterOptions = {
  storage:
    environmentVariables.FILES_STORAGE_TYPE === 'remote'
      ? getRemoteStorage()
      : getLocalStorage(),
  limits: {
    fileSize: megabytesToBytes(10),
  },
  fileFilter,
};

export default multerConfig;
