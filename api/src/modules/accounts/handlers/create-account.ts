import { RegisterEndpoint } from '../../../types/api';
import { AccountService } from '../account.service';
import { CreateAccountDto } from '../types/account.dto';
import { createAccountSchema, accountResponseSchema } from '../account.validators';

export const createAccountEndpoint: RegisterEndpoint<AccountService> = ({ route, fastify, service }) => {
  fastify.route<{ Body: CreateAccountDto }>({
    method: 'POST',
    url: route,
    schema: {
      tags: ['account'],
      body: createAccountSchema,
      response: {
        201: accountResponseSchema,
      }
    },
    handler: async (request, reply) => {
      const createdAccount = await service.createAccount(request.body);
      reply.status(201).send(createdAccount);
    }
  });
};
