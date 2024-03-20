import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sigin.dto';
import { Public } from './strategy/jwt-auth.guard';
import { RequestRecoverPasswordCodeDto } from './dto/request-recover-password-code.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('password/recover/code')
  @HttpCode(204)
  requestRecoverPasswordCode(
    @Query() recoverPasswordDto: RequestRecoverPasswordCodeDto,
  ) {
    return this.authService.requestRecoverPasswordCode(recoverPasswordDto);
  }

  @Post('password/recover')
  @HttpCode(204)
  recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.authService.recoverPassword(recoverPasswordDto);
  }
}
