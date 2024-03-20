import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sigin.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RequestRecoverPasswordCodeDto } from './dto/request-recover-password-code.dto';
import { MailService } from '../mail/mail.service';
import { environmentVariables } from 'src/config/environment-variables';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import AppException from 'src/exception-filters/app-exception/app-exception';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersService.findByEmail({
      email,
      withPassword: true,
    });

    if (!user || !user.password) {
      throw new AppException('Email ou senha inválidos', 401);
    }

    if (!user.isActive) {
      throw new AppException(
        'Usuário inativo, entre em contato com a administração',
        401,
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppException('Email ou senha inválidos', 401);
    }

    const payload = {
      id: user.id,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async requestRecoverPasswordCode({ email }: RequestRecoverPasswordCodeDto) {
    const user = await this.usersService.findByEmail({
      email,
    });

    if (!user) {
      return;
    }

    const key = `recover-code:${user.email}`;

    const existingCode = await this.cacheManager.get<string>(key);
    if (existingCode) {
      throw new AppException(
        'Aguarde alguns minutos para solicitar um novo código',
        429,
      );
    }

    const code = this.generateCryptoRandomString(5);
    const expirationInMinutes = 10;

    this.cacheManager.set(key, code, expirationInMinutes * 60 * 1000);

    this.mailService.sendRecoverPasswordMail({
      to: user.email,
      name: user.name,
      recoverCode: code,
      recoverUrl: `${environmentVariables.FRONT_URL}/login/forgot?email=${user.email}&code=${code}`,
    });
  }

  async recoverPassword({ email, code, password }: RecoverPasswordDto) {
    const user = await this.usersService.findByEmail({
      email,
      mode: 'ensureExistence',
    });

    const key = `recover-code:${user.email}`;
    const existingCode = await this.cacheManager.get<string>(key);

    if (!existingCode || existingCode !== code) {
      throw new AppException('Código inválido ou expirado', 400);
    }

    await this.usersService.updatePassword({
      id: user.id,
      password,
    });

    this.cacheManager.del(key);
  }

  async addTemporaryPasswordToUser(
    user: User,
    passwordLength = 8,
  ) {
    const temporaryPassword = this.generateCryptoRandomString(passwordLength);

    user.password = await hash(temporaryPassword, 12);
    return temporaryPassword;
  }

  async validateUserCredentials(id: string) {
    const user = await this.usersService.findById({ id });

    if (!user || !user.email || !user.password) {
      return false;
    }

    return user;
  }

  generateCryptoRandomString(length: number) {
    return crypto.randomBytes(4).toString('hex').substring(0, length);
  }
}
