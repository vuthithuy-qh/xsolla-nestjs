import { Injectable } from '@nestjs/common';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrderService {
  private orders: Map<string, Order> = new Map();

  create(order: Partial<Order>): Order {
    const newOrder = new Order({
      ...order,
      status: OrderStatus.PENDING,
    });

    this.orders.set(newOrder.id || '', newOrder);
    console.log(' Order created:', newOrder.id);
    return newOrder;
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  findByTransactionId(transactionId: number): Order | undefined {
    for (const order of this.orders.values()) {
      if (order.xsolla_transaction_id === transactionId) {
        return order;
      }
    }
    return undefined;
  }

  findByUserId(userId: string): Order[] {
    const userOrders: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.user_id === userId) {
        userOrders.push(order);
      }
    }
    return userOrders;
  }

  update(id: string, data: Partial<Order>): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;

    Object.assign(order, data);
    order.updated_at = new Date();
    console.log(' Order updated:', id, data);
    return order;
  }

  markAsPaid(
    id: string,
    transactionId: number,
    paymentMethod: number,
  ): Order | undefined {
    return this.update(id, {
      status: OrderStatus.PAID,
      xsolla_transaction_id: transactionId,
      payment_method: paymentMethod,
      paid_at: new Date(),
    });
  }

  markAsRefunded(id: string): Order | undefined {
    return this.update(id, {
      status: OrderStatus.REFUNDED,
    });
  }

  getAll(): Order[] {
    return Array.from(this.orders.values());
  }
}
