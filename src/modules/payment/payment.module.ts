import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderService } from './order.service';
import xsollaConfig from '../../config/xsolla.config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forFeature(xsollaConfig),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, OrderService],
  exports: [PaymentService, OrderService],
})
export class PaymentModule {}