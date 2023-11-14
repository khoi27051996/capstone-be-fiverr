import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/nguoi-dung/entities/nguoi-dung.entities';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/sign-up')
  signUp(@Body() body: User) {
    return this.authService.signUp(body)
  }

  @Post('/sign-in')
  signIn(@Body() body) {
    return this.authService.signIn(body)
  }
}
