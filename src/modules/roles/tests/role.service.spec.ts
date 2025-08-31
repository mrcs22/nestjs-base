import { Test, TestingModule } from "@nestjs/testing";
import { RolesService } from "../roles.service";
import { AbstractRolesRepository } from "../repositories/abstract.roles.repository";
import { ListAllRolesDto } from "../dto/list-roles.dto";
import {
  RoleFactory,
  CreateroleDtoFactory,
  UpdateroleDtoFactory,
} from "./factory/role";
import { Role } from "../entities/role.entity";
import AppException from "src/exception-filters/app-exception/app-exception";
import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";

describe("roleService", () => {
  let roleService: RolesService;
  let roleRepository: AbstractRolesRepository;

  beforeEach(async () => {
    const mockroleRepository: AbstractRolesRepository = {
      create: jest.fn(),
      update: jest.fn(),
      listAll: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: AbstractRolesRepository,
          useValue: mockroleRepository,
        },
      ],
    }).compile();

    roleService = module.get<RolesService>(RolesService);
    roleRepository = module.get<AbstractRolesRepository>(
      AbstractRolesRepository,
    );
  });

  describe("create", () => {
    it("should create a new active role", async () => {
      const createroleDto = CreateroleDtoFactory.generate();
      createroleDto.isActive = true;

      jest.spyOn(roleRepository, "findByName").mockResolvedValue(null);

      const expectedrole = new Role();
      expectedrole.fromDto(createroleDto);

      jest.spyOn(roleRepository, "create").mockResolvedValue(expectedrole);

      const result = await roleService.create(createroleDto);
      expect(result).toEqual(expectedrole);
    });

    it("should create a new inactive role", async () => {
      const createroleDto = CreateroleDtoFactory.generate();
      createroleDto.isActive = false;

      jest.spyOn(roleRepository, "findByName").mockResolvedValue(null);

      const expectedrole = new Role();
      expectedrole.fromDto(createroleDto);

      jest.spyOn(roleRepository, "create").mockResolvedValue(expectedrole);

      const result = await roleService.create(createroleDto);
      expect(result).toEqual(expectedrole);
    });

    it("should throw an error if the role name already exists", async () => {
      const createroleDto = CreateroleDtoFactory.generate();

      const role = new Role();
      role.fromDto(createroleDto);

      jest.spyOn(roleRepository, "findByName").mockResolvedValue(role);

      await expect(roleService.create(createroleDto)).rejects.toMatchObject(
        new AppException(`Já existe um cargo com este nome`, 409),
      );
    });
  });

  describe("listAll", () => {
    it("should return a not simplified list of role", async () => {
      const listAllroleDto = new ListAllRolesDto();
      const simplified = false;

      const expectedrole = RoleFactory.generateManyListed(5);

      jest
        .spyOn(roleRepository, "listAll")
        .mockResolvedValue([expectedrole, expectedrole.length]);

      const result = await roleService.listAll(listAllroleDto, simplified);

      expect(result).toEqual([expectedrole, expectedrole.length]);
    });
  });

  describe("update", () => {
    it("should update role if its name is not used before", async () => {
      const id = faker.string.uuid();
      const updateroleDto = UpdateroleDtoFactory.generate();

      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(existingrole);

      jest.spyOn(roleRepository, "findByName").mockResolvedValue(null);

      const expectedrole = new Role();
      expectedrole.fromDto(updateroleDto);
      expectedrole.id = id;
      jest.spyOn(roleRepository, "update").mockResolvedValue(expectedrole);

      const result = await roleService.update(id, updateroleDto);

      expect(result).toEqual(expectedrole);
    });

    it("should update role if exists same name but its same role", async () => {
      const updateroleDto = UpdateroleDtoFactory.generate();

      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(existingrole);

      jest.spyOn(roleRepository, "findByName").mockResolvedValue(existingrole);

      jest.spyOn(roleRepository, "update").mockResolvedValue(existingrole);

      const result = await roleService.update(existingrole.id, updateroleDto);

      expect(result).toEqual(existingrole);
    });

    it("should throw error if the role does not exist", async () => {
      const id = faker.string.uuid();
      const updateroleDto = UpdateroleDtoFactory.generate();

      jest.spyOn(roleRepository, "findById").mockResolvedValue(null);

      await expect(roleService.update(id, updateroleDto)).rejects.toMatchObject(
        new AppException(`Cargo não encontrado`, HttpStatus.NOT_FOUND),
      );
    });

    it("should throw an error if the role name already exists and is not updated one", async () => {
      const updateroleDto = UpdateroleDtoFactory.generate();

      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(existingrole);

      const conflictingrole = RoleFactory.generate();
      jest
        .spyOn(roleRepository, "findByName")
        .mockResolvedValue(conflictingrole);

      await expect(
        roleService.update(existingrole.id, updateroleDto),
      ).rejects.toMatchObject(
        new AppException(
          `Já existe um cargo com este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe("remove", () => {
    it("should remove a role", async () => {
      const id = faker.string.uuid();

      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(existingrole);
      await roleService.remove(id);

      expect(roleRepository.remove).toHaveBeenCalledWith(id);
    });

    it("should throw an error if the role does not exist", async () => {
      const id = faker.string.uuid();

      jest.spyOn(roleRepository, "findById").mockResolvedValue(null);

      await expect(roleService.remove(id)).rejects.toMatchObject(
        new AppException(`Cargo não encontrado`, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe("findByName", () => {
    it("should return a role", async () => {
      const expectedrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findByName").mockResolvedValue(expectedrole);

      const result = await roleService.findByName({
        name: expectedrole.name,
      });

      expect(result).toEqual(expectedrole);
    });

    it("should return null if the role does not exist", async () => {
      jest.spyOn(roleRepository, "findByName").mockResolvedValue(null);

      const result = await roleService.findByName({
        name: faker.lorem.words(),
      });

      expect(result).toBeNull();
    });

    it("should throw an error if the role does not exist and mode is ensureExistence", async () => {
      jest.spyOn(roleRepository, "findByName").mockResolvedValue(null);

      const name = faker.lorem.words();
      await expect(
        roleService.findByName({
          name: name,
          mode: "ensureExistence",
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Nenhum cargo com esse nome foi encontrado`,
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it("should throw an error if the role exists and mode is ensureNonExistence", async () => {
      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findByName").mockResolvedValue(existingrole);

      const name = faker.lorem.words();
      await expect(
        roleService.findByName({
          name,
          mode: "ensureNonExistence",
        }),
      ).rejects.toMatchObject(
        new AppException(
          `Já existe um cargo com este nome`,
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe("findById", () => {
    it("should return a role", async () => {
      const expectedrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(expectedrole);

      const result = await roleService.findById({
        id: expectedrole.id,
      });

      expect(result).toEqual(expectedrole);
    });

    it("should return null if the role does not exist", async () => {
      jest.spyOn(roleRepository, "findById").mockResolvedValue(null);

      const result = await roleService.findById({
        id: faker.string.uuid(),
      });

      expect(result).toBeNull();
    });

    it("should throw an error if the role does not exist and mode is ensureExistence", async () => {
      jest.spyOn(roleRepository, "findById").mockResolvedValue(null);

      const id = faker.string.uuid();
      await expect(
        roleService.findById({
          id,
          mode: "ensureExistence",
        }),
      ).rejects.toMatchObject(
        new AppException(`Cargo não encontrado`, HttpStatus.NOT_FOUND),
      );
    });

    it("should throw an error if the role exists and mode is ensureNonExistence", async () => {
      const existingrole = RoleFactory.generate();
      jest.spyOn(roleRepository, "findById").mockResolvedValue(existingrole);

      await expect(
        roleService.findById({
          id: existingrole.id,
          mode: "ensureNonExistence",
        }),
      ).rejects.toMatchObject(
        new AppException(`Existe outro cargo com este id`, HttpStatus.CONFLICT),
      );
    });
  });
});
