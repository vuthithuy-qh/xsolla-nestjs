import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WebhookNotification } from '../payment/dto/payment-webhook.dto';

@Injectable()
export class WebhookService {
  /**
   * Handle webhook notifications from Xsolla
   */
  handleWebhook(notification: WebhookNotification): { message: string; status: number } {
    const { notification_type } = notification;

    console.log('📥 Webhook received:', notification_type);
    console.log('📦 Full notification:', JSON.stringify(notification, null, 2));

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
//   private handleUserValidation(notification: WebhookNotification): { message: string; status: number } {
//     const userId = notification.user?.id;

//     // Check if this is a test webhook from Xsolla
//     if (userId && userId.startsWith('test_xsolla')) {
//       throw new HttpException(
//         {
//           error: {
//             code: 'INVALID_USER',
//             message: 'Invalid user',
//           },
//         },
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     // TODO: Add your user validation logic here
//     // Example: Check if user exists in your database
//     console.log('User validation for:', userId);

//     return { message: 'User is valid', status: 200 };
//   }

private handleUserValidation(notification: WebhookNotification): { message: string; status: number } {
  const userId = notification.user?.id;

  console.log('🔍 User validation check for:', userId);
  console.log('📦 Full data:', JSON.stringify(notification, null, 2));


  // ⭐ LUÔN trả về success
  console.log('✅ User validation PASSED for:', userId);
  
  return { 
    message: 'User is valid', 
    status: 200 
  };
}

  /**
   * Handle successful payment
   */
  private handlePayment(notification: WebhookNotification): { message: string; status: number } {
    const userId = notification.user?.id;
    const transactionId = notification.transaction?.id;
    const items = notification.purchase?.virtual?.items || [];

    console.log('Payment received:', {
      userId,
      transactionId,
      items,
    });

    // TODO: Add your payment processing logic here
    // Example:
    // - Save transaction to database
    // - Grant items to user
    // - Send confirmation email
    console.log("granting items to user:", items);

    return { message: 'Payment processed successfully', status: 200 };
  }

  /**
   * Handle refund
   */
  private handleRefund(notification: WebhookNotification): { message: string; status: number } {
    const userId = notification.user?.id;
    const refund = notification.refund;

    console.log('Refund received:', {
      userId,
      refund,
    });

    // TODO: Add your refund processing logic here
    // Example:
    // - Revoke items from user
    // - Update transaction status

    return { message: 'Refund processed successfully', status: 200 };
  }
}