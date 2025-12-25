import { AnySchema } from 'ajv';

export const createApplicationSchema: AnySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
  },
  required: ['name'],
  additionalProperties: false,
};

export const applicationResponseSchema: AnySchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    account_id: { type: 'integer' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
  required: [
    'id',
    'name',
    'created_at',
    'updated_at',
  ],
  additionalProperties: false,
};
