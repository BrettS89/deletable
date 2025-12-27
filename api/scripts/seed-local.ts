import { config } from 'dotenv';
config();
import { postgres } from '../src/storage/db/postgres/db';
import { RoleService } from '../src/modules/roles/role.service';
import { AccountService } from '../src/modules/accounts/account.service';
import { ApplicationService } from '../src/modules/applications/application.service';

const seed = async () => {
  try {
    await postgres.connect({
      host: 'localhost',
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    });

    const roleService = new RoleService(postgres.pool);
    const accountService = new AccountService(postgres.pool);
    const applicationService = new ApplicationService(postgres.pool);
    
    await roleService.createRole({ name: 'user' });

    const account = await accountService.createAccount({ name: 'deletable' });

    const application = await applicationService.createApplication({
      name: 'deletable-api',
      accountId: account.id,
    });

    console.log(application.applicationApiKey, application.application.id);
  } catch (e) {
    console.log(e);
  } finally {
    await postgres.close();
  }
};

seed();
