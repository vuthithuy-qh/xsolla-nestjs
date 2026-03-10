import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import xsollaConfig from '../../config/xsolla.config';
import { SignatureUtil } from '../utils/signature.utils';

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  constructor(
    @Inject(xsollaConfig.KEY)
    private config: ConfigType<typeof xsollaConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['authorization'];

    //  Phải có rawBody, nếu không có thì cần setup middleware
    const rawBody = request.rawBody || JSON.stringify(request.body);

    console.log(' Webhook signature verification:');
    console.log('  Signature header:', signature);
    console.log('  Raw body length:', rawBody.length);
    console.log('  Project key set:', !!this.config.projectKey);

    if (!signature) {
      throw new UnauthorizedException('Missing signature header');
    }

    if (!rawBody) {
      throw new UnauthorizedException('Missing raw body');
    }

    //  Dùng projectKey, không phải webhookSecretKey
    const isValid = SignatureUtil.verifySignature(
      signature,
      rawBody,
      this.config.projectKey || '',
    );

    console.log('  Verification result:', isValid ? ' PASS' : ' FAIL');

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }
}
