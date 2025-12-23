import { Pool } from 'pg';
import { IngestRepository } from './ingest.repository';
import { IngestBatchDto } from './types/ingest.dto';
import { FieldUsageWithEndpointIdAndContext, EndpointMethodAndPath } from './types/ingest.domain'; 
import { EndpointUsage } from './types/ingest.dto';

export class IngestService {
  constructor(private db: Pool) {}

  async ingestBatch(ingestBatchDto: IngestBatchDto) {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');

      const ingestRepo = new IngestRepository(client);
    
      const exists = await ingestRepo.insertIngestBatch(
        ingestBatchDto.service_id,
        ingestBatchDto.batch_id
      );

      if (exists) {
        await client.query('COMMIT');
        return { ok: true };
      }

      const endpoints = await ingestRepo.upsertEndpointUsage(
        ingestBatchDto.service_id,
        ingestBatchDto.endpoint_usage
      );

      const fields = this.formatFieldUsage(endpoints, ingestBatchDto.endpoint_usage);

      await ingestRepo.upsertFieldUsage(ingestBatchDto.service_id, fields);

      await client.query('COMMIT');

      return { ok: true };
    } catch(e) {
      try {
        await client.query('ROLLBACK');
      } catch(e) { console.log('rollback failed') }
      throw e;
    } finally {
      client.release();
    }
  }

  formatFieldUsage(endpoints: EndpointMethodAndPath[], endpointUsage: EndpointUsage[]): FieldUsageWithEndpointIdAndContext[] {
    const endpointIdMap: Record<string, bigint> = endpoints.reduce((acc: Record<string, bigint>, curr) => {
        acc[`${curr.method}|${curr.path}`] = curr.id;

        return acc;
      }, {});

    const fields: FieldUsageWithEndpointIdAndContext[] = [];

    endpointUsage.forEach(endpoint => {
      const methodAndPath = `${endpoint.method}|${endpoint.path}`;
      const endpointId = endpointIdMap[methodAndPath];

      Object.entries(endpoint.field_usage).forEach(([fieldContext, fieldUsage]) => {
        fieldUsage.forEach(field => {
          fields.push({
            ...field,
            context: fieldContext,
            endpoint_id: endpointId,
          });
        });
      });
    });

    return fields;
  }
}
