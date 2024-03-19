interface IMailAttachmentProps {
  name: string;
  path: string;
  fileExtension?: string;
  contentType?: string;
}

class MailAttachment {
  name: string;
  path: string;
  fileExtension: string;
  contentType: string;

  constructor({
    name,
    path,
    fileExtension,
    contentType,
  }: IMailAttachmentProps) {
    this.name = name;
    this.path = path;
    this.fileExtension = fileExtension || 'pdf';
    this.contentType = contentType || 'application/pdf';
  }
}

export { MailAttachment, IMailAttachmentProps };
