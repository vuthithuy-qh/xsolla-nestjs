import { registerAs } from '@nestjs/config';

export default registerAs('xsolla', () => ({
  projectId: process.env.XSOLLA_PROJECT_ID,
  apiKey: process.env.XSOLLA_API_KEY,
  projectKey: process.env.XSOLLA_PROJECT_KEY, // ← Thêm dòng này
  merchantId: process.env.XSOLLA_MERCHANT_ID, // ← Có thể cần
  loginId: process.env.XSOLLA_LOGIN_ID,
  apiUrl: process.env.XSOLLA_API_URL || 'https://store.xsolla.com/api/v3',
  sandboxPaystationUrl:
    process.env.XSOLLA_SANDBOX_PAYSTATION_URL ||
    'https://sandbox-secure.xsolla.com/paystation4',
  paystationUrl:
    process.env.XSOLLA_PAYSTATION_URL ||
    'https://secure.xsolla.com/paystation4',
}));
