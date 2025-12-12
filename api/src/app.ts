import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import ajvFormats from 'ajv-formats';
import ajvKeywords from 'ajv-keywords';
import qs from 'qs';

import { postgres } from './storage/db/postgres/db';
import { errorHandler } from './middleware/error-handler';
import { addFormatServiceParamsHook } from './middleware/format-params';

export const initApp = async () => {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      redact: ['req.headers.authorization', 'req.headers.cookie']
    },
    trustProxy: true,
    bodyLimit: 1_048_576,
    ajv: {
      customOptions: {
        allErrors: true,
        removeAdditional: true,  // optional but common
        coerceTypes: true        // optional
      },
      plugins: [
        ajvFormats,
        [ajvKeywords, ['transform']]
      ]
    },
    querystringParser: str => qs.parse(str, {
      decoder: function (str, defaultDecoder, charset, type) {
        const decoded = defaultDecoder(str, charset);
        if (type === 'value' && decoded === 'null') {
          return null;
        }
        return decoded;
      }
    })
  });

  fastify.addHook('onRequest', async (req, _reply) => {
    req.log.info({ id: req.id, method: req.method, url: req.url, ip: req.ip }, 'request start');
  });

  fastify.addHook('onResponse', async (req, reply) => {
    req.log.info({ id: req.id, status: reply.statusCode }, 'request complete');
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  await fastify.register(compress, {
    global: true,
    threshold: 1024,
    encodings: ["br", "gzip"],
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true
    }
  });

  await fastify.register(import('@fastify/swagger'))

  await fastify.register(import('@fastify/swagger-ui'), {
    theme: {
      title: 'deletable api'
    },
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true,
    transformSpecificationClone: true
  });

  addFormatServiceParamsHook(fastify);

  fastify.setErrorHandler(errorHandler);

  return fastify;
};
