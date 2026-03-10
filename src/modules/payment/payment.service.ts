import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { randomBytes } from 'crypto';
import type { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import xsollaConfig from '../../config/xsolla.config';
import { CreatePaymentTokenDto } from './dto/create-payment-token.dto';
import { OrderService } from './order.service';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(xsollaConfig.KEY)
    private config: ConfigType<typeof xsollaConfig>,
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {}

  /**
   * Create payment token for Xsolla PayStation
   * Flow: Create Order → Get external_id → Create token on Xsolla
   */
  async createPaymentToken(dto: CreatePaymentTokenDto): Promise<any> {
    const url = `${this.config.apiUrl}/project/${this.config.projectId}/admin/payment/token`;

    const auth = Buffer.from(
      `${this.config.projectId}:${this.config.apiKey}`,
    ).toString('base64');

    // 1. Create Order (PENDING status)
    const orderId = this.generateId();
    const totalAmount = dto.purchase.items.reduce((sum, item) => {
      return sum + (item.quantity || 1);
    }, 0);

    const order = this.orderService.create({
      id: orderId,
      user_id: dto.user.id.value,
      items: dto.purchase.items,
      amount: totalAmount,
      status: OrderStatus.PENDING,
    });

    console.log(' Order created for payment:', {
      orderId: order.id,
      userId: order.user_id,
      items: order.items,
    });

    // 2. Build request with external_id
    const paymentRequest = {
      ...dto,
      settings: {
        external_id: order.id, // ← Use order ID as external_id
        return_url: dto.settings?.return_url,
      },
    };

    console.log(' Creating Xsolla payment token with external_id:', order.id);

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, paymentRequest, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
        }),
      );

      const token = response.data.token;
      const paystationUrl = dto.sandbox
        ? `${this.config.sandboxPaystationUrl}/?token=${token}`
        : `${this.config.paystationUrl}/?token=${token}`;

      // 3. Store token in order
      order.xsolla_token = token;

      console.log(' Payment token created successfully');

      return {
        external_id: order.id,
        token,
        paystationUrl,
        order,
        ...response.data,
      };
    } catch (error) {
      console.error(
        ' Failed to create payment token:',
        error.response?.data || error.message,
      );
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

  /**
   * Generate UUID-like ID using crypto
   */
  private generateId(): string {
    const bytes = randomBytes(8);
    return bytes.toString('hex');
  }
}
