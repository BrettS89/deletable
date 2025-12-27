import crypto from 'crypto';
import { Pool } from 'pg';
import { envVars } from '../../config/environment-variables';
import { PostgresCrud } from '../../storage/db/postgres/crud';
import { TABLES } from '../../storage/db/postgres/tables';
import { ApplicationApiKeyRow, ApplicationRow } from './types/application.row';
import { Application, ApplicationApiKey } from './types/application.domain';

function base64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

type CreateApplicationResponse = {
  application: Application;
  applicationApiKey: string;
}

export class ApplicationService {
  constructor(private pool: Pool) {}

  async createApplication({ name, accountId }: { name: string; accountId: bigint }): Promise<CreateApplicationResponse> {

    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const applicationCrud = new PostgresCrud(client, TABLES.APPLICATIONS);
  
      const application = await applicationCrud.create<ApplicationRow>({
        name: name,
        account_id: accountId,
      });

      const apiKey = this.generateApplicationApiKey();

      const applicationKeyCrud = new PostgresCrud(client, TABLES.APPLICATION_API_KEYS);

      const applicationApiKey = await applicationKeyCrud.create<ApplicationApiKeyRow>({
        application_id: application.id,
        account_id: accountId,
        public_key: apiKey.keyId,
        secret_hash: apiKey.secretHash,
        status: 'active',
      });

      await client.query('COMMIT');

      return {
        application,
        applicationApiKey: `ApiKey ${applicationApiKey.public_key}.${apiKey.secretKey}`,
      };
    } catch(e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  private generateApplicationApiKey() {
    const API_KEY_PREFIX = 'del';
    const KEY_ID_BYTES = 16;
    const SECRET_BYTES = 32;

    const API_KEY_PEPPER = envVars.API_KEY_PEPPER;

    if (!API_KEY_PEPPER) {
      throw new Error('API_KEY_PEPPER is required');
    }

    const keyId = `${API_KEY_PREFIX}_${base64url(
      crypto.randomBytes(KEY_ID_BYTES)
    )}`;

    const secret = `${API_KEY_PREFIX}_sk_${base64url(
      crypto.randomBytes(SECRET_BYTES)
    )}`;

    const secretHash = crypto
      .createHmac('sha256', API_KEY_PEPPER)
      .update(secret)
      .digest('hex');

    return {
      keyId,
      secretHash,
      secretKey: secret,
      apiKey: `${keyId}.${secret}`,
    }
  }
}
