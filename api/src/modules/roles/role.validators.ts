import { AnySchema } from 'ajv';

export const createRoleSchema: AnySchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
  },
  required: ['name'],
  additionalProperties: false,
};

export const roleResponseSchema: AnySchema = {
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
