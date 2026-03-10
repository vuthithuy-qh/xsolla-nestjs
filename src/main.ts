import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚠️ QUAN TRỌNG: Capture raw body cho webhook
  app.use(
    '/payment/xsolla-webhook',
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf.toString('utf8');
      },
    }),
  );

  // Global JSON parser cho các routes khác
  app.use(bodyParser.json());

  await app.listen(8080);
}
bootstrap();
