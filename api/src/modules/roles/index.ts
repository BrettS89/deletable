import { FastifyInstance } from 'fastify';
import { RoleService } from './role.service';
import { createRoleEndpoint } from './handler/create-role';

export const registerRoleRoutes = (fastify: FastifyInstance) => {
  const roleService = new RoleService(fastify.db.pool);

  createRoleEndpoint({ route: '/role', fastify, service: roleService });
};
