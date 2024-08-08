import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('google')
export class GoogleController {

    constructor(private readonly googleService: GoogleService) {}

    @Get()
    @ApiTags('Google Account operations')
    @ApiOperation({summary:"login"})
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}
  
    @Get('redirect')
    @ApiTags('Google Account operations')
    @ApiOperation({summary:"redirect"})
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
      return this.googleService.googleLogin(req)
    }

}
