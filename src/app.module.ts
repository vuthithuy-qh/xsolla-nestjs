import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './modules/payment/payment.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import xsollaConfig from './config/xsolla.config';
import { json } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [xsollaConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'views'),
      serveRoot: '/',
    }),
    PaymentModule,
    WebhookModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // For webhook, capture raw body BEFORE JSON parsing
    consumer
      .apply((req, res, next) => {
        if (req.path === '/payment/xsolla-webhook') {
          let data = '';
          req.setEncoding('utf8');
          req.on('data', (chunk) => {
            data += chunk;
          });
          req.on('end', () => {
            req.rawBody = data;
            req.body = JSON.parse(data);
            next();
          });
        } else {
          next();
        }
      })
      .forRoutes('*');

    // Parse JSON for all other routes
    consumer.apply(json()).exclude('payment/xsolla-webhook').forRoutes('*');
  }
}
