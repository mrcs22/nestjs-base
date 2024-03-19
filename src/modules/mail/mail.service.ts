import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { environmentVariables } from 'src/config/environmentVariables';
import { MailAttachment } from 'src/types/modules/mail/mailAttachment';

export interface ISendTemporyPasswordMailParams {
  to: string;
  name: string;
  temporaryPassword: string;
}

export interface ISendRecoverPasswordMailParams {
  to: string;
  name: string;
  recoverCode: string;
  recoverUrl: string;
}

@Injectable()
export class MailService {
  constructor() {}

  async sendTemporyPasswordMail({
    to,
    name,
    temporaryPassword,
  }: ISendTemporyPasswordMailParams): Promise<void> {
    const subject = 'Primeiro acesso - Senha temporária';
    const templatePath = `${__dirname}/../../static/mail/templates/temporaryPasswordMail.html`;

    await this.sendMail({
      to,
      subject,
      data: { name, temporaryPassword },
      templatePath,
      attachments: [],
    });
  }

  async sendRecoverPasswordMail({
    to,
    name,
    recoverCode,
    recoverUrl,
  }: ISendRecoverPasswordMailParams): Promise<void> {
    const subject = 'Recuperação de senha';
    const templatePath = `${__dirname}/../../static/mail/templates/recoverPasswordMail.html`;

    await this.sendMail({
      to,
      subject,
      data: { name, recoverCode, recoverUrl },
      templatePath,
      attachments: [],
    });
  }

  private async sendMail({
    to,
    subject,
    data,
    templatePath,
    attachments,
  }: {
    to: string;
    subject: string;
    data: object;
    templatePath: string;
    attachments: MailAttachment[];
  }): Promise<void> {
    if (!environmentVariables.SHOULD_SEND_EMAILS)
      return console.info(
        'Emails are disabled. Skipping sending email to',
        to,
        'with subject',
        subject,
      );

    const logoUrl = `${environmentVariables.API_URL}/files/public/assets/image/logo.png`;
    const html = await this.generateFromTemplate(templatePath, {
      logoUrl,
      ...data,
    });

    const message: Mail.Options = {
      to,
      from: `Fictional Company <${environmentVariables.SMTP_USER}>`,
      subject,
      html,
    };

    if (attachments && attachments.length > 0) {
      message.attachments = attachments.map((attachment) => ({
        filename: `${attachment.name}.${attachment.fileExtension}`,
        path: attachment.path,
        contentType: attachment.contentType,
      }));
    }

    const transportData: SMTPTransport.Options = {
      service: environmentVariables.SMTP_SERVICE,
      host: environmentVariables.SMTP_HOST,
      port: environmentVariables.SMTP_PORT,
      secure: true,
      auth: {
        user: environmentVariables.SMTP_USER,
        pass: environmentVariables.SMTP_PASS,
      },
    };

    const transport = nodemailer.createTransport(transportData);

    const retryLimit = 5;
    const retryDelayInMinutes = 5;
    let sendAttempts = 0;

    const sendMail = async () => {
      sendAttempts++;

      try {
        await transport.sendMail(message);
      } catch (error) {
        if (sendAttempts > retryLimit) {
          console.error(
            `Retry limit exceeded. Failed to send email to ${to} with subject "${subject}"`,
          );

          return;
        }

        console.error(
          `Failed to send email to ${to} with subject "${subject}", retrying for the ${sendAttempts} time in ${retryDelayInMinutes} minutes`,
        );
        setTimeout(sendMail, retryDelayInMinutes * 60 * 1000);
      }
    };

    sendMail();
  }

  private async generateFromTemplate(
    templatePath: string,
    variables: object,
  ): Promise<string> {
    const templateFileContent = readFileSync(templatePath).toString('utf-8');
    const templateParse = Handlebars.compile(templateFileContent);

    return templateParse(variables);
  }
}
