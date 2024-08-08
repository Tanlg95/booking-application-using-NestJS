import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from './google.strategy'

@Module({
  providers: [GoogleService, GoogleStrategy],
  controllers: [GoogleController]
})
export class GoogleModule {}
