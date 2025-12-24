import { FastifyInstance } from 'fastify';
import { AccountService } from './account.service';
import { createAccountEndpoint } from './handlers/create-account';

export const registerAccountRoutes = (fastify: FastifyInstance) => {
  const accountService = new AccountService(fastify.db.pool);

  createAccountEndpoint({ route: '/account', fastify, service: accountService });
};
