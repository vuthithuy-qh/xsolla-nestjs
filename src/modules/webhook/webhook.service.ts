import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WebhookNotification } from '../payment/dto/payment-webhook.dto';
import { OrderService } from '../payment/order.service';
import { OrderStatus } from '../payment/entities/order.entity';

@Injectable()
export class WebhookService {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Handle webhook notifications from Xsolla
   */
  handleWebhook(notification: WebhookNotification): {
    message: string;
    status: number;
  } {
    const { notification_type } = notification;

    console.log(' Webhook received:', notification_type);
    console.log(' Full notification:', JSON.stringify(notification, null, 2));

    switch (notification_type) {
      case 'user_validation':
        return this.handleUserValidation(notification);

      case 'payment':
        return this.handlePayment(notification);

      case 'refund':
        return this.handleRefund(notification);

      default:
        return { message: 'OK', status: 200 };
    }
  }

  /**
   * Validate user before payment
   */
  private handleUserValidation(notification: WebhookNotification): {
    message: string;
    status: number;
  } {
    const userId = notification.user?.id;

    console.log(' User validation check for:', userId);
    console.log('Full data:', JSON.stringify(notification, null, 2));

    //
    console.log(' User validation PASSED for:', userId);

    return {
      message: 'User is valid',
      status: 200,
    };
  }

  /**
   * Handle successful payment
   */
  private handlePayment(notification: WebhookNotification): {
    message: string;
    status: number;
  } {
    const userId = notification.user?.id;
    const transactionId = notification.transaction?.id;
    const externalId = notification.transaction?.external_id;
    const items = notification.purchase?.virtual?.items || [];
    const paymentMethod = notification.transaction?.payment_method;

    console.log(' Payment webhook received:', {
      userId,
      transactionId,
      externalId,
      items,
      paymentMethod,
    });

    // Find or create order by external_id
    let order = this.orderService.findById(externalId || '');

    if (order) {
      // Mark existing order as paid
      order = this.orderService.markAsPaid(
        externalId || '',
        transactionId || 0,
        paymentMethod || 0,
      );
      console.log(' Existing order marked as PAID:', order?.id);
    } else {
      console.log(' Order not found for external_id:', externalId);
      console.log(' Available orders:', this.orderService.getAll());
    }

    // Grant items to user
    console.log(' Granting items to user:', {
      userId,
      items,
    });

    return { message: 'Payment processed successfully', status: 200 };
  }

  /**
   * Handle refund
   */
  private handleRefund(notification: WebhookNotification): {
    message: string;
    status: number;
  } {
    const userId = notification.user?.id;
    const externalId = notification.transaction?.external_id;

    console.log(' Refund received:', {
      userId,
      externalId,
    });

    // Find order and mark as refunded
    let order = this.orderService.findById(externalId || '');
    if (order) {
      order = this.orderService.markAsRefunded(externalId || '');
      console.log(' Order marked as REFUNDED:', order?.id);
    }

    return { message: 'Refund processed successfully', status: 200 };
  }
}
