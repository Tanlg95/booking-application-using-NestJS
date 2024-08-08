import { Module } from '@nestjs/common';
import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';

@Module({
  controllers: [XmlController],
  providers: [XmlService]
})
export class XmlModule {}
