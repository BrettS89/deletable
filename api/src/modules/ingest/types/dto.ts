export const KNOWN_TYPES = [
  'string',
  'number',
  'boolean',
  'null',
  'object',
  'array',
] as const;

export type KnownType = typeof KNOWN_TYPES[number];

export type TypeCounts = Partial<Record<KnownType, number>>;

type FieldUsage = {
  field_path: string;
  type_counts: TypeCounts;
  observations: number;
};

type EndpointUsage = {
  method: string;
  path: string;
  total_hits: number;
  field_usage: Partial<Record<
  'request_body' | 'response_body' | 'query_param' | 'header', FieldUsage[]
  >>;
};

export type IngestBatchDto = {
  batch_id: string;
  service_id: number;
  endpoint_usage: EndpointUsage[];
};
