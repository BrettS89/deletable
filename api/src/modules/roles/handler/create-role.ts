import { RegisterEndpoint } from '../../../types/api';
import { RoleService } from '../role.service';
import { CreateRoleDto } from '../types/role.dto';
import { createRoleSchema, roleResponseSchema } from '../role.validators';

export const createRoleEndpoint: RegisterEndpoint<RoleService> = ({ route, fastify }) => {
  fastify.route<{ Body: CreateRoleDto }>({
    method: 'POST',
    url: route,
    schema: {
      tags: ['role'],
      body: createRoleSchema,
      response: {
        201: roleResponseSchema,
      }
    },
    handler: async (request, reply) => {
      const roleService = new RoleService(fastify.db.pool);
      const createdRole = await roleService.createRole(request.body);
      reply.status(201).send(createdRole);
    }
  });
};
