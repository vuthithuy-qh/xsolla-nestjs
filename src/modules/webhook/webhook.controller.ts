import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookSignatureGuard } from '../../common/guard/webhook-signature.guard';
import type { WebhookNotification } from '../payment/dto/payment-webhook.dto';

@Controller('payment/xsolla-webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT) // ← Đổi từ OK thành NO_CONTENT
  @UseGuards(WebhookSignatureGuard)
  async handleWebhook(@Body() notification: WebhookNotification) {
    await this.webhookService.handleWebhook(notification);
    // Không return gì cả (204 không có body)
  }
}
