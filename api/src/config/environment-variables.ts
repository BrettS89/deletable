import { Ajv, AnySchema } from 'ajv';

const schema: AnySchema = {
  type: 'object',
  properties: {
    ENVIRONMENT: { type: 'string', enum: ['local', 'dev', 'prod'] },
    PORT: { type: 'string' },
    PG_HOST: { type: 'string' },
    PG_PORT: { type: 'string', pattern: '^[1-9]\\d*$' },
    PG_USER: { type: 'string' },
    PG_PASSWORD: { type: 'string' },
    PG_DATABASE: { type: 'string' },
    POSTGRES_URL: { type: 'string' },
    JWT_SECRET: { type: 'string' },
  },
  required: [
    'PORT',
    'PG_HOST',
    'PG_PORT',
    'PG_USER',
    'PG_PASSWORD',
    'PG_DATABASE',
    'JWT_SECRET',
  ],
};

export const validateEnvironmentVariables = () => {
  const ajv = new Ajv();

  const valid = ajv.validate(schema, process.env);

  if (!valid) {
    if (Array.isArray(ajv.errors)) {
      throw new Error(ajv.errors.map(el => el.message).join(', '));
    }

    throw new Error('Environment variable config validation error.');
  }
};
