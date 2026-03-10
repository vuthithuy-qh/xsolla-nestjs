import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Render,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { CreatePaymentTokenDto } from './dto/create-payment-token.dto';
import xsollaConfig from '../../config/xsolla.config';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject(xsollaConfig.KEY)
    private config: ConfigType<typeof xsollaConfig>,
  ) {}

  @Post('token')
  async createToken(@Body(ValidationPipe) dto: CreatePaymentTokenDto) {
    return this.paymentService.createPaymentToken(dto);
  }

  @Get('config')
  getConfig() {
    return {
      projectId: this.config.projectId,
      loginId: this.config.loginId,
      ...(process.env.NODE_ENV === 'development' && {
        apiKey: this.config.apiKey,
      }),
    };
  }
}
