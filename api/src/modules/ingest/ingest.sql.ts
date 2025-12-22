export const insertIngestBatchSql = `
  INSERT INTO ingest_batches (service_id, batch_id)
  VALUES ($1, $2)
  ON CONFLICT (service_id, batch_id) DO NOTHING
  RETURNING 1
`;

export const upsertEndpointUsageSql = `
  INSERT INTO endpoints (service_id, account_id, method, path, total_hits, first_seen_at, last_seen_at)
  SELECT
    $1,
    s.account_id,
    x.method,
    x.path,
    x.total_hits,
    now(),
    now()
  FROM unnest($2::text[], $3::text[], $4::bigint[]) 
    AS x(method, path, total_hits)
  JOIN services s ON s.id = $1
  ON CONFLICT (service_id, method, path)
  DO UPDATE SET
    total_hits   = endpoints.total_hits + EXCLUDED.total_hits,
    last_seen_at = now()
  RETURNING id, method, path;
`;

export const upsertFieldUsage = `
  INSERT INTO field_usage (
    account_id,
    service_id,
    endpoint_id,
    context,
    field_path,
    first_seen_at,
    last_seen_at,
    type_counts,
    total_observations
  )
  SELECT
    s.account_id,
    $1,
    x.endpoint_id,
    x.context::field_context,
    x.field_path,
    now(),
    now(),
    x.type_counts::jsonb,
    x.total_observations
  FROM unnest(
    $2::bigint[],
    $3::text[],
    $4::text[],
    $5::jsonb[],
    $6::bigint[]
  ) AS x(
    endpoint_id,
    context,
    field_path,
    type_counts,
    total_observations
  )
  JOIN services s ON s.id = $1
  ON CONFLICT (endpoint_id, context, field_path)
  DO UPDATE SET
    total_observations = field_usage.total_observations + EXCLUDED.total_observations,
    last_seen_at = now(),
    type_counts = field_usage.type_counts || EXCLUDED.type_counts
`;
