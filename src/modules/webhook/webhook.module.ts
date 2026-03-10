import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import xsollaConfig from '../../config/xsolla.config';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(xsollaConfig),
    PaymentModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}