import { AnySchema } from 'ajv';

export const ingestBatchRequestSchema: AnySchema = {
  $id: 'IngestBatchDto',
  type: 'object',
  additionalProperties: false,
  required: ['batch_id', 'application_id', 'endpoint_usage'],
  properties: {
    batch_id: { type: 'string' }, // optionally add: format: 'uuid'
    application_id: { type: 'integer' },
    endpoint_usage: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['method', 'path', 'total_hits', 'field_usage'],
        properties: {
          method: { type: 'string' },
          path: { type: 'string' },
          total_hits: { type: 'integer' },
          field_usage: {
            type: 'object',
            additionalProperties: false,
            properties: {
              request_body: { $ref: '#/$defs/fieldUsageArray' },
              response_body: { $ref: '#/$defs/fieldUsageArray' },
              query_param: { $ref: '#/$defs/fieldUsageArray' },
              header: { $ref: '#/$defs/fieldUsageArray' },
            },
          },
        },
      },
    },
  },

  $defs: {
    // Constrained set of keys: string|number|boolean|null|object|array
    typeCounts: {
      type: 'object',
      additionalProperties: false,
      properties: {
        string: { type: 'integer', minimum: 0 },
        number: { type: 'integer', minimum: 0 },
        boolean: { type: 'integer', minimum: 0 },
        null: { type: 'integer', minimum: 0 },
        object: { type: 'integer', minimum: 0 },
        array: { type: 'integer', minimum: 0 },
      },
    },
    fieldUsage: {
      type: 'object',
      additionalProperties: false,
      required: ['field_path', 'type_counts', 'observations'],
      properties: {
        field_path: { type: 'string' },
        type_counts: { $ref: '#/$defs/typeCounts' },
        observations: { type: 'integer', minimum: 0 },
      },
    },
    fieldUsageArray: {
      type: 'array',
      items: { $ref: '#/$defs/fieldUsage' },
    },
  },
};
