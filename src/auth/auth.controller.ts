import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDTO } from './dto/signup.request';
import { loginRequestDTO } from './dto/login.request';
import { JwtAuthGuard } from 'utils/middlewares/jwt.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  createUser(@Body() SignUpRequest: SignUpRequestDTO) {
    return this.authService.createUser(SignUpRequest);
  }

  @Post('/login')
  login(@Body() loginRequest: loginRequestDTO) {
    return this.authService.login(loginRequest);
  }
  // @Get('/getMe')
  // @UseGuards(JwtAuthGuard)
  // getMe(@Req() req:any ) {
  //   return this.authService.getMe(req.user_details);
  // }

  // @Get('/getHello')
  // getHello() {
  //   return this.authService.getHello();
  // }
}
