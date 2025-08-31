import { HttpStatus, Injectable } from "@nestjs/common";
import AppException from "src/exception-filters/app-exception/app-exception";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AbstractUsersRepository } from "./repositories/abstract.users.repository";
import { User } from "./entities/user.entity";
import { ListAllUsersDto } from "./dto/list-users.dto";
import {
  FindServiceMode,
  FindServiceResult,
} from "src/types/modules/find-service-mode";
import { hash } from "bcrypt";
import { MailService } from "../mail/mail.service";
import { RolesService } from "../roles/roles.service";
import { environmentVariables } from "src/config/environment-variables";
import { Attachment } from "../attachments/entities/attachment.entity";

@Injectable()
export class UsersService {
  constructor(
    private userRepository: AbstractUsersRepository,
    private rolesService: RolesService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let profilePicture: Attachment | null = null;

    if (createUserDto.picture) {
      profilePicture = new Attachment();
      profilePicture.fromFile(createUserDto.picture);
    }

    await this.findByEmail({
      email: createUserDto.data.email,
      mode: "ensureNonExistence",
    });

    const user = new User();
    user.fromDto(createUserDto);
    user.picture = profilePicture;

    user.role = await this.rolesService.findById({
      id: createUserDto.data.role.id,
      mode: "ensureExistence",
    });

    const createdUser = await this.userRepository.create(user);

    this.mailService.sendConfirmEmailMail({
      to: user.email,
      name: user.name,
      confirmUrl: `${environmentVariables.FRONT_URL}/login/confirm-email?email=${user.email}`,
    });

    return createdUser;
  }

  listAll<Simplified extends boolean>(
    params: ListAllUsersDto,
    simplified: Simplified,
  ) {
    return this.userRepository.listAll(params, simplified);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let profilePicture: Attachment | null = null;

    if (updateUserDto.picture) {
      profilePicture = new Attachment();
      profilePicture.fromFile(updateUserDto.picture);
    }

    const user = await this.findById({ id, mode: "ensureExistence" });

    const isEmailUpdate = user.email !== updateUserDto.data.email;
    if (isEmailUpdate) {
      const existingUserWithEmail = await this.userRepository.findByEmail({
        email: updateUserDto.data.email,
      });

      if (existingUserWithEmail && existingUserWithEmail.id !== id) {
        throw new AppException(
          `Existe outro cadastro com este email`,
          HttpStatus.CONFLICT,
        );
      }
    }

    user.fromDto(updateUserDto);
    user.role = await this.rolesService.findById({
      id: updateUserDto.data.role.id,
      mode: "ensureExistence",
    });
    if (profilePicture) user.picture = profilePicture;

    const shouldDeleteCurrentPicture = updateUserDto.picture === null;
    if (shouldDeleteCurrentPicture && user.picture) {
      user.picture.deletePhysicalFile();
      user.picture = null;
    }

    const updatedUser = await this.userRepository.update(user);

    if (user.email && isEmailUpdate) {
      this.mailService.sendConfirmEmailMail({
        to: user.email,
        name: user.name,
        confirmUrl: `${environmentVariables.FRONT_URL}/login/confirm-email?email=marcusmoraes2010@hotmail.com`,
      });
    }

    return updatedUser;
  }

  async remove(id: string) {
    await this.findById({
      id,
      mode: "ensureExistence",
    });

    await this.userRepository.remove(id);
  }

  async findByName<Mode extends FindServiceMode>(params: {
    name: string;
    mode?: Mode;
  }) {
    const { name, mode = "default" } = params;
    const existingUser = await this.userRepository.findByName(name);

    if (existingUser && mode === "ensureNonExistence") {
      throw new AppException(
        `Existe outro cadastro come este nome`,
        HttpStatus.CONFLICT,
      );
    }

    if (!existingUser && mode === "ensureExistence") {
      throw new AppException(
        `Nenhum cadastro com esse nome foi encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findById<Mode extends FindServiceMode>(params: {
    id: string;
    mode?: Mode;
  }) {
    const { id, mode = "default" } = params;
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser && mode === "ensureExistence") {
      throw new AppException(`Não encontrado`, HttpStatus.NOT_FOUND);
    }

    if (existingUser && mode === "ensureNonExistence") {
      throw new AppException(
        `Existe outro cadastro com este id`,
        HttpStatus.CONFLICT,
      );
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async findByEmail<Mode extends FindServiceMode>(params: {
    email: string;
    mode?: Mode;
    withPassword?: boolean;
  }) {
    const { email, mode = "default", withPassword } = params;
    const existingUser = await this.userRepository.findByEmail({
      email,
      withPassword,
    });

    if (existingUser && mode === "ensureNonExistence") {
      throw new AppException("Já existe um colaborador com este email", 409);
    }

    if (!existingUser && mode === "ensureExistence") {
      throw new AppException("Colaborador não encontrado", 404);
    }

    return existingUser as FindServiceResult<User, Mode>;
  }

  async updatePassword({ id, password }: { id: string; password: string }) {
    const user = await this.findById({
      id,
      mode: "ensureExistence",
    });

    user.password = await hash(password, 12);

    await this.userRepository.update(user);
  }
}
