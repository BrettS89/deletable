import { FastifyInstance } from 'fastify';
import { createApplicationEndpoint } from './handlers/create-application';

export const registerApplicationRoutes = (fastify: FastifyInstance) => {
  createApplicationEndpoint({ route: '/application', fastify });
};
