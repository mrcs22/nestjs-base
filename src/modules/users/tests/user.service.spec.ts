import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { AbstractUsersRepository } from '../repositories/abstract.users.repository';
import { ListAllUsersDto } from '../dto/list-users.dto';
import {
  UserFactory,
  CreateuserDtoFactory,
  UpdateuserDtoFactory,
} from './factory/user';
import { User } from '../entities/user.entity';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { RolesModule } from 'src/modules/roles/roles.module';
import { MailModule } from 'src/modules/mail/mail.module';

jest.mock('../../roles/roles.service')
jest.mock('../../roles/roles.controller')
jest.mock('../../roles/repositories/typeorm/roles.repository')

jest.mock('../../mail/mail.service')

describe('userService', () => {
  let userService: UsersService;
  let userRepository: AbstractUsersRepository;

  beforeEach(async () => {
    const mockuserRepository: AbstractUsersRepository = {
      create: jest.fn(),
      update: jest.fn(),
      listAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [RolesModule, MailModule],
      providers: [
        UsersService,
        {
          provide: AbstractUsersRepository,
          useValue: mockuserRepository,
        },
        {
          provide: AbstractUsersRepository,
          useValue: mockuserRepository,
        }
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<AbstractUsersRepository>(
      AbstractUsersRepository,
    );
  });

  describe('create', () => {
    it('should create a new active user', async () => {
      const createuserDto = CreateuserDtoFactory.generate();
      createuserDto.isActive = true;

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      const expecteduser = new User();
      expecteduser.fromDto(createuserDto);

      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(expecteduser);

      const result = await userService.create(createuserDto);
      expect(result).toEqual(expecteduser);
    });

    it('should create a new inactive user', async () => {
      const createuserDto = CreateuserDtoFactory.generate();
      createuserDto.isActive = false;

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      const expecteduser = new User();
      expecteduser.fromDto(createuserDto);

      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(expecteduser);

      const result = await userService.create(createuserDto);
      expect(result).toEqual(expecteduser);
    });

    it('should throw an error if the user name already exists', async () => {
      const createuserDto = CreateuserDtoFactory.generate();

      const user = new User();
      user.fromDto(createuserDto);

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(user);

      await expect(
        userService.create(createuserDto),
      ).rejects.toMatchObject(
        new AppException(`Existe outro cadastro come este nome`, 409),
      );
    });
  });

  describe('listAll', () => {
    it('should return a not simplified list of user', async () => {
      const listAlluserDto = new ListAllUsersDto();
      const simplified = false;

      const expecteduser = UserFactory.generateManyListed(5);

      jest
        .spyOn(userRepository, 'listAll')
        .mockResolvedValue([expecteduser, expecteduser.length]);

      const result = await userService.listAll(
        listAlluserDto,
        simplified,
      );

      expect(result).toEqual([expecteduser, expecteduser.length]);
    });
  });

  describe('update', () => {
    it('should update user if its name is not used before', async () => {
      const id = faker.string.uuid();
      const updateuserDto = UpdateuserDtoFactory.generate();

      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(existinguser);

      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      const expecteduser = new User();
      expecteduser.fromDto(updateuserDto);
      expecteduser.id = id;
      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(expecteduser);

      const result = await userService.update(id, updateuserDto);

      expect(result).toEqual(expecteduser);
    });

    it('should update user if exists same name but its same user', async () => {
      const updateuserDto = UpdateuserDtoFactory.generate();

      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(existinguser);

      jest
        .spyOn(userRepository, 'findByName')
        .mockResolvedValue(existinguser);

      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(existinguser);

      const result = await userService.update(
        existinguser.id,
        updateuserDto,
      );

      expect(result).toEqual(existinguser);
    });

    it('should throw error if the user does not exist', async () => {
      const id = faker.string.uuid();
      const updateuserDto = UpdateuserDtoFactory.generate();

      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(
        userService.update(id, updateuserDto),
      ).rejects.toMatchObject(
        new AppException(`Não encontrado`, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the user name already exists and is not updated one', async () => {
      const updateuserDto = UpdateuserDtoFactory.generate();

      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(existinguser);

      const conflictinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findByName')
        .mockResolvedValue(conflictinguser);

      await expect(
        userService.update(existinguser.id, updateuserDto),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro cadastro come este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = faker.string.uuid();

      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(existinguser);
      await userService.remove(id);

      expect(userRepository.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the user does not exist', async () => {
      const id = faker.string.uuid();

      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(userService.remove(id)).rejects.toMatchObject(
        new AppException(`Não encontrado`, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findByName', () => {
    it('should return a user', async () => {
      const expecteduser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findByName')
        .mockResolvedValue(expecteduser);

      const result = await userService.findByName({
        name: expecteduser.name,
      });

      expect(result).toEqual(expecteduser);
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      const result = await userService.findByName({
        name: faker.lorem.words(),
      });

      expect(result).toBeNull();
    });

    it('should throw an error if the user does not exist and mode is ensureExistence', async () => {
      jest.spyOn(userRepository, 'findByName').mockResolvedValue(null);

      const name = faker.lorem.words();
      await expect(
        userService.findByName({
          name: name,
          mode: 'ensureExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Nenhum cadastro com esse nome foi encontrado`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if the user exists and mode is ensureNonExistence', async () => {
      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findByName')
        .mockResolvedValue(existinguser);

      const name = faker.lorem.words();
      await expect(
        userService.findByName({
          name,
          mode: 'ensureNonExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro cadastro come este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const expecteduser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(expecteduser);

      const result = await userService.findById({
        id: expecteduser.id,
      });

      expect(result).toEqual(expecteduser);
    });

    it('should return null if the user does not exist', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const result = await userService.findById({
        id: faker.string.uuid(),
      });

      expect(result).toBeNull();
    });

    it('should throw an error if the user does not exist and mode is ensureExistence', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const id = faker.string.uuid();
      await expect(
        userService.findById({
          id,
          mode: 'ensureExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(`Não encontrado`, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the user exists and mode is ensureNonExistence', async () => {
      const existinguser = UserFactory.generate();
      jest
        .spyOn(userRepository, 'findById')
        .mockResolvedValue(existinguser);

      await expect(
        userService.findById({
          id: existinguser.id,
          mode: 'ensureNonExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro cadastro com este id`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
});
