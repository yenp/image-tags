import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
 if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp))
    nestApp.use(eventContext());
    nestApp.useStaticAssets(join(__dirname, '.', 'public'));
    nestApp.setBaseViewsDir(join(__dirname, '.', 'views'));
    nestApp.setViewEngine('hbs');
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
 }
 return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
 cachedServer = await bootstrapServer();
 return proxy(cachedServer, event, context, 'PROMISE').promise;
}