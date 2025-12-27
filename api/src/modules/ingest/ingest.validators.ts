export const typeCountsSchema = {
  $id: 'TypeCounts',
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
} as const;

export const fieldUsageSchema = {
  $id: 'FieldUsage',
  type: 'object',
  additionalProperties: false,
  required: ['field_path', 'type_counts', 'observations'],
  properties: {
    field_path: { type: 'string' },
    type_counts: { $ref: 'TypeCounts#' },   // or '#/components/schemas/TypeCounts' depending on your setup
    observations: { type: 'integer', minimum: 0 },
  },
} as const;

export const fieldUsageArraySchema = {
  $id: 'FieldUsageArray',
  type: 'array',
  items: { $ref: 'FieldUsage#' },
} as const;

export const ingestBatchRequestSchema = {
  $id: 'IngestBatchDto',
  type: 'object',
  additionalProperties: false,
  required: ['batch_id', 'application_id', 'endpoint_usage'],
  properties: {
    batch_id: { type: 'string' },
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
              request_body: { $ref: 'FieldUsageArray#' },
              response_body: { $ref: 'FieldUsageArray#' },
              query_param: { $ref: 'FieldUsageArray#' },
              header: { $ref: 'FieldUsageArray#' },
            },
          },
        },
      },
    },
  },
} as const;