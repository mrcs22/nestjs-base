import * as fs from 'fs';

function deleteFile(filePath: string) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  });
}

export { deleteFile };
