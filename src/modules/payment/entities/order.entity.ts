export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export class Order {
  id: string;
  user_id: string;
  items: any[]; // Items purchased
  amount: number;
  status: OrderStatus;
  xsolla_token?: string; // Token from Xsolla
  xsolla_transaction_id?: number; // Transaction ID from webhook
  payment_method?: number;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<Order>) {
    Object.assign(this, data);
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
