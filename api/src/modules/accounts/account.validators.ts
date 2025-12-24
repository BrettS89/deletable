import { AnySchema } from 'ajv';

export const createAccountSchema: AnySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
  },
  required: ['name'],
  additionalProperties: false,
};

export const accountResponseSchema: AnySchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
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
