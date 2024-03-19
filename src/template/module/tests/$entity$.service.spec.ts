import { Test, TestingModule } from '@nestjs/testing';
import { $Entities$Service } from '../$entities$.service';
import { Abstract$Entities$Repository } from '../repositories/abstract.$entities$.repository';
import { ListAll$Entities$Dto } from '../dto/listAll$Entities$.dto';
import {
  $Entity$Factory,
  Create$Entity$DtoFactory,
  Update$Entity$DtoFactory,
} from './factory/$entity$';
import { $Entity$ } from '../entities/$entity$.entity';
import AppException from 'src/exceptionFilters/AppException/AppException';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';

describe('$entity$Service', () => {
  let $entity$Service: $Entities$Service;
  let $entity$Repository: Abstract$Entities$Repository;

  beforeEach(async () => {
    const mock$entity$Repository: Abstract$Entities$Repository = {
      create: jest.fn(),
      update: jest.fn(),
      listAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        $Entities$Service,
        {
          provide: Abstract$Entities$Repository,
          useValue: mock$entity$Repository,
        },
      ],
    }).compile();

    $entity$Service = module.get<$Entities$Service>($Entities$Service);
    $entity$Repository = module.get<Abstract$Entities$Repository>(
      Abstract$Entities$Repository,
    );
  });

  describe('create', () => {
    it('should create a new active $entity$', async () => {
      const create$entity$Dto = Create$Entity$DtoFactory.generate();
      create$entity$Dto.isActive = true;

      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue(null);

      const expected$entity$ = new $Entity$();
      expected$entity$.fromDto(create$entity$Dto);

      jest
        .spyOn($entity$Repository, 'create')
        .mockResolvedValue(expected$entity$);

      const result = await $entity$Service.create(create$entity$Dto);
      expect(result).toEqual(expected$entity$);
    });

    it('should create a new inactive $entity$', async () => {
      const create$entity$Dto = Create$Entity$DtoFactory.generate();
      create$entity$Dto.isActive = false;

      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue(null);

      const expected$entity$ = new $Entity$();
      expected$entity$.fromDto(create$entity$Dto);

      jest
        .spyOn($entity$Repository, 'create')
        .mockResolvedValue(expected$entity$);

      const result = await $entity$Service.create(create$entity$Dto);
      expect(result).toEqual(expected$entity$);
    });

    it('should throw an error if the $entity$ name already exists', async () => {
      const create$entity$Dto = Create$Entity$DtoFactory.generate();

      const $entity$ = new $Entity$();
      $entity$.fromDto(create$entity$Dto);

      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue($entity$);

      await expect(
        $entity$Service.create(create$entity$Dto),
      ).rejects.toMatchObject(
        new AppException(`Existe outro(a) $entity_pt$ come este nome`, 409),
      );
    });
  });

  describe('listAll', () => {
    it('should return a not simplified list of $entity$', async () => {
      const listAll$entity$Dto = new ListAll$Entities$Dto();
      const simplified = false;

      const expected$entity$ = $Entity$Factory.generateManyListed(5);

      jest
        .spyOn($entity$Repository, 'listAll')
        .mockResolvedValue([expected$entity$, expected$entity$.length]);

      const result = await $entity$Service.listAll(
        listAll$entity$Dto,
        simplified,
      );

      expect(result).toEqual([expected$entity$, expected$entity$.length]);
    });
  });

  describe('update', () => {
    it('should update $entity$ if its name is not used before', async () => {
      const id = faker.string.uuid();
      const update$entity$Dto = Update$Entity$DtoFactory.generate();

      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(existing$entity$);

      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue(null);

      const expected$entity$ = new $Entity$();
      expected$entity$.fromDto(update$entity$Dto);
      expected$entity$.id = id;
      jest
        .spyOn($entity$Repository, 'update')
        .mockResolvedValue(expected$entity$);

      const result = await $entity$Service.update(id, update$entity$Dto);

      expect(result).toEqual(expected$entity$);
    });

    it('should update $entity$ if exists same name but its same $entity$', async () => {
      const update$entity$Dto = Update$Entity$DtoFactory.generate();

      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(existing$entity$);

      jest
        .spyOn($entity$Repository, 'findByName')
        .mockResolvedValue(existing$entity$);

      jest
        .spyOn($entity$Repository, 'update')
        .mockResolvedValue(existing$entity$);

      const result = await $entity$Service.update(
        existing$entity$.id,
        update$entity$Dto,
      );

      expect(result).toEqual(existing$entity$);
    });

    it('should throw error if the $entity$ does not exist', async () => {
      const id = faker.string.uuid();
      const update$entity$Dto = Update$Entity$DtoFactory.generate();

      jest.spyOn($entity$Repository, 'findById').mockResolvedValue(null);

      await expect(
        $entity$Service.update(id, update$entity$Dto),
      ).rejects.toMatchObject(
        new AppException(`$Entity_pt$ não encontrado(a)`, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the $entity$ name already exists and is not updated one', async () => {
      const update$entity$Dto = Update$Entity$DtoFactory.generate();

      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(existing$entity$);

      const conflicting$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findByName')
        .mockResolvedValue(conflicting$entity$);

      await expect(
        $entity$Service.update(existing$entity$.id, update$entity$Dto),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro(a) $entity_pt$ come este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a $entity$', async () => {
      const id = faker.string.uuid();

      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(existing$entity$);
      await $entity$Service.remove(id);

      expect($entity$Repository.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error if the $entity$ does not exist', async () => {
      const id = faker.string.uuid();

      jest.spyOn($entity$Repository, 'findById').mockResolvedValue(null);

      await expect($entity$Service.remove(id)).rejects.toMatchObject(
        new AppException(`$Entity_pt$ não encontrado(a)`, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findByName', () => {
    it('should return a $entity$', async () => {
      const expected$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findByName')
        .mockResolvedValue(expected$entity$);

      const result = await $entity$Service.findByName({
        name: expected$entity$.name,
      });

      expect(result).toEqual(expected$entity$);
    });

    it('should return null if the $entity$ does not exist', async () => {
      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue(null);

      const result = await $entity$Service.findByName({
        name: faker.lorem.words(),
      });

      expect(result).toBeNull();
    });

    it('should throw an error if the $entity$ does not exist and mode is ensureExistence', async () => {
      jest.spyOn($entity$Repository, 'findByName').mockResolvedValue(null);

      const name = faker.lorem.words();
      await expect(
        $entity$Service.findByName({
          name: name,
          mode: 'ensureExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Nenhum(a) $entity_pt$ com esse nome foi encontrado(a)`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if the $entity$ exists and mode is ensureNonExistence', async () => {
      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findByName')
        .mockResolvedValue(existing$entity$);

      const name = faker.lorem.words();
      await expect(
        $entity$Service.findByName({
          name,
          mode: 'ensureNonExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro(a) $entity_pt$ come este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('findById', () => {
    it('should return a $entity$', async () => {
      const expected$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(expected$entity$);

      const result = await $entity$Service.findById({
        id: expected$entity$.id,
      });

      expect(result).toEqual(expected$entity$);
    });

    it('should return null if the $entity$ does not exist', async () => {
      jest.spyOn($entity$Repository, 'findById').mockResolvedValue(null);

      const result = await $entity$Service.findById({
        id: faker.string.uuid(),
      });

      expect(result).toBeNull();
    });

    it('should throw an error if the $entity$ does not exist and mode is ensureExistence', async () => {
      jest.spyOn($entity$Repository, 'findById').mockResolvedValue(null);

      const id = faker.string.uuid();
      await expect(
        $entity$Service.findById({
          id,
          mode: 'ensureExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(`$Entity_pt$ não encontrado(a)`, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if the $entity$ exists and mode is ensureNonExistence', async () => {
      const existing$entity$ = $Entity$Factory.generate();
      jest
        .spyOn($entity$Repository, 'findById')
        .mockResolvedValue(existing$entity$);

      await expect(
        $entity$Service.findById({
          id: existing$entity$.id,
          mode: 'ensureNonExistence',
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Existe outro(a) $entity_pt$ com este id`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
});
