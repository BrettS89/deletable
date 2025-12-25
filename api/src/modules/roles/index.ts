import { FastifyInstance } from 'fastify';
import { createRoleEndpoint } from './handler/create-role';

export const registerRoleRoutes = (fastify: FastifyInstance) => {
  createRoleEndpoint({ route: '/role', fastify });
};
