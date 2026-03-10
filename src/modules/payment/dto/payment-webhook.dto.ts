export interface WebhookNotification {
  notification_type: string;
  user?: {
    id: string;
    name?: string;
  };
  purchase?: {
    virtual?: {
      items?: Array<{
        sku: string;
        amount: number;
      }>;
    };
  };
  transaction?: {
    id: number;
    external_id: string;
    payment_date: string;
    payment_method: number;
    dry_run: number;
    agreement: number;
  };
  refund?: any;
}