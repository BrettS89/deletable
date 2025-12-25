import { FastifyInstance } from 'fastify';
import { createAccountEndpoint } from './handlers/create-account';

export const registerAccountRoutes = (fastify: FastifyInstance) => {
  createAccountEndpoint({ route: '/account', fastify });
};
