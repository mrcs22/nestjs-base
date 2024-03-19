import { Test, TestingModule } from '@nestjs/testing';
import {
  MailService,
  ISendTemporyPasswordMailParams,
  ISendRecoverPasswordMailParams,
} from './mail.service';
import nodemailer from 'nodemailer';
import { faker } from '@faker-js/faker';

jest.mock('nodemailer');
jest.useFakeTimers();

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    mailService = module.get<MailService>(MailService);

    jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({}),
    } as any);

    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('sendTemporyPasswordMail', () => {
    it('should send temporary password mail', async () => {
      const params: ISendTemporyPasswordMailParams = {
        to: faker.internet.email(),
        name: faker.lorem.words(2),
        temporaryPassword: faker.lorem.words({
          min: 8,
          max: 255,
        }),
      };

      await expect(
        mailService.sendTemporyPasswordMail(params),
      ).resolves.toBeUndefined();

      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
    });

    it('should retry to 5 times send temporary password mail if sendMail fails', async () => {
      const mockSendMail = jest
        .fn()
        .mockRejectedValue(new Error('Simulated error'));

      jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
        sendMail: mockSendMail,
      } as any);

      const to = faker.internet.email();

      const params: ISendTemporyPasswordMailParams = {
        to,
        name: faker.lorem.words(2),
        temporaryPassword: faker.lorem.words({
          min: 8,
          max: 255,
        }),
      };

      jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        mailService.sendTemporyPasswordMail(params),
      ).resolves.toBeUndefined();
      const retryTimes = 5;

      const subject = 'Primeiro acesso - Senha temporária';

      for (let i = 1; i <= retryTimes; i++) {
        jest.advanceTimersByTime(5 * 60 * 1000);
        await Promise.resolve();

        expect(console.error).toHaveBeenCalledWith(
          `Failed to send email to ${to} with subject "${subject}", retrying for the 1 time in 5 minutes`,
        );
      }

      expect(console.error).toHaveBeenCalledWith(
        `Retry limit exceeded. Failed to send email to ${to} with subject "${subject}"`,
      );
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(
        retryTimes + 1,
      );
    });
  });

  describe('sendRecoverPasswordMail', () => {
    it('should send recover password mail', async () => {
      const params: ISendRecoverPasswordMailParams = {
        to: faker.internet.email(),
        name: faker.lorem.words(2),
        recoverCode: faker.string.hexadecimal({ length: 5 }),
        recoverUrl: faker.internet.url(),
      };

      await expect(
        mailService.sendRecoverPasswordMail(params),
      ).resolves.toBeUndefined();

      expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
    });
  });
});
