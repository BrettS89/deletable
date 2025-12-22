import { FieldUsage } from './ingest.dto';

export type FieldUsageWithEndpointIdAndContext = FieldUsage & { endpoint_id: bigint; context: string };

export type EndpointMethodAndPath = {
  id: bigint;
  method: string;
  path: string;    
}
