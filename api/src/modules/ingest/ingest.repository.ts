import pg from 'pg';
import { EndpointUsage } from './types/ingest.dto';
import { FieldUsageWithEndpointIdAndContext, EndpointMethodAndPath } from './types/ingest.domain';
import { insertIngestBatchSql, upsertEndpointUsageSql, upsertFieldUsage } from './ingest.sql';

export class IngestRepository {
  constructor(private db: pg.Pool | pg.PoolClient) {}

  async insertIngestBatch(serviceId: bigint, batchId: string) {    
    const res = await this.db.query(insertIngestBatchSql, [serviceId, batchId]);

    return res.rowCount === 1;
  }

  async upsertEndpointUsage(serviceId: bigint, endpointUsage: EndpointUsage[]): Promise<EndpointMethodAndPath[]> {
    const methods: string[] = [];
    const paths: string[] = [];
    const hits: bigint[] = [];

    endpointUsage.forEach(endpointUsage => {
      methods.push(endpointUsage.method);
      paths.push(endpointUsage.path);
      hits.push(endpointUsage.total_hits);
    });

    const result = await this.db.query<EndpointMethodAndPath>(
      upsertEndpointUsageSql,
      [serviceId, methods, paths, hits]
    );

    return result.rows;
  }

  async upsertFieldUsage(serviceId: bigint, fieldUsage: FieldUsageWithEndpointIdAndContext[]) {
    const endpointIds: bigint[] = [];
    const contexts: string[] = [];
    const fieldPaths: string[] = [];
    const typeCounts: string[] = [];
    const observations: number[] = [];

    fieldUsage.forEach(r => {
      endpointIds.push(r.endpoint_id);
      contexts.push(r.context);
      fieldPaths.push(r.field_path);
      typeCounts.push(JSON.stringify(r.type_counts));
      observations.push(r.observations);
    });

    await this.db.query(
      upsertFieldUsage,
      [
        serviceId,
        endpointIds,
        contexts,
        fieldPaths,
        typeCounts,
        observations,
      ]
    );
  }

}
