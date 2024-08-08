import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { XmlService } from 'src/support/file-format/xml/xml.service';

@Module({
    controllers:[PaymentController],
    providers: [PaymentService, XmlService],
    imports:[HttpModule]
})
export class PaymentModule {}
