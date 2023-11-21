import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags } from '@nestjs/swagger';
import { SignIn, SignUp } from './entities/authEntities';

@ApiTags('Auth')

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  
  @Post('/sign-up')
  signUp(@Body() body: SignUp) {
    return this.authService.signUp(body)
  }

  @Post('/sign-in')
  signIn(@Body() body : SignIn) {
    return this.authService.signIn(body)
  }
}
