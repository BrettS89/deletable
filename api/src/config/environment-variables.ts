import Ajv, { JSONSchemaType } from 'ajv';

type EnvVars = {
  ENVIRONMENT: 'local' | 'dev' | 'prod';
  PORT: number;
  PG_HOST: string;
  PG_PORT: number;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_DATABASE: string;
  POSTGRES_URL?: string;
  JWT_SECRET: string;
  API_KEY_PEPPER: string
};

const schema: JSONSchemaType<EnvVars> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ENVIRONMENT: { type: 'string', enum: ['local', 'dev', 'prod'] },
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    PG_HOST: { type: 'string', minLength: 1 },
    PG_PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    PG_USER: { type: 'string', minLength: 1 },
    PG_PASSWORD: { type: 'string', minLength: 1 },
    PG_DATABASE: { type: 'string', minLength: 1 },
    POSTGRES_URL: { type: 'string', nullable: true, minLength: 1 },
    JWT_SECRET: { type: 'string', minLength: 32 },
    API_KEY_PEPPER: { type: 'string' },
  },
  required: [
    'ENVIRONMENT',
    'PORT',
    'PG_HOST',
    'PG_PORT',
    'PG_USER',
    'PG_PASSWORD',
    'PG_DATABASE',
    'JWT_SECRET',
    'API_KEY_PEPPER',
  ],
};

export function validateEnvironmentVariables(): Readonly<EnvVars> {
  const ajv = new Ajv({ allErrors: true, coerceTypes: true });

  const validate = ajv.compile(schema);

  const data: Record<string, unknown> = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    PORT: process.env.PORT,
    PG_HOST: process.env.PG_HOST,
    PG_PORT: process.env.PG_PORT,
    PG_USER: process.env.PG_USER,
    PG_PASSWORD: process.env.PG_PASSWORD,
    PG_DATABASE: process.env.PG_DATABASE,
    POSTGRES_URL: process.env.POSTGRES_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEY_PEPPER: process.env.API_KEY_PEPPER,
  };

  const ok = validate(data);

  if (!ok) {
    const details = (validate.errors ?? [])
      .map(e => `${e.instancePath || '(root)'} ${e.message ?? ''}`.trim())
      .join(', ');
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return Object.freeze(data as EnvVars);
}

export const envVars = validateEnvironmentVariables();
