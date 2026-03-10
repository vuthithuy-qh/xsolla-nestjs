import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import xsollaConfig from '../../config/xsolla.config';
import { CreatePaymentTokenDto } from './dto/create-payment-token.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(xsollaConfig.KEY)
    private config: ConfigType<typeof xsollaConfig>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Create payment token for Xsolla PayStation
   */
  async createPaymentToken(dto: CreatePaymentTokenDto): Promise<any> {
    const url = `${this.config.apiUrl}/project/${this.config.projectId}/admin/payment/token`;
    
    // Create Basic Auth header
    const auth = Buffer.from(
      `${this.config.projectId}:${this.config.apiKey}`,
    ).toString('base64');

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, dto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
        }),
      );

      const token = response.data.token;
      const paystationUrl = dto.sandbox
        ? `${this.config.sandboxPaystationUrl}/?token=${token}`
        : `${this.config.paystationUrl}/?token=${token}`;

      return {
        token,
        paystationUrl,
        ...response.data,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to create payment token',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get payment URL for sandbox or production
   */
  getPaymentUrl(token: string, sandbox: boolean): string {
    return sandbox
      ? `${this.config.sandboxPaystationUrl}/?token=${token}`
      : `${this.config.paystationUrl}/?token=${token}`;
  }
}