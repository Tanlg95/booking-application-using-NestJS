import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './token/auth.module';
import { GoogleModule } from './google/google.module';
import { XmlModule } from './support/file-format/xml/xml.module';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [UserModule, AuthModule, GoogleModule, XmlModule, PaymentModule],
  // controllers: [AppController, UserController],
  // providers: [AppService],
  // controllers: [PaymentController],
  // providers: [PaymentService],
  controllers: [],
  providers: [],
})
export class AppModule {}
