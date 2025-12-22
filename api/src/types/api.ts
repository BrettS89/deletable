import { FastifyInstance } from 'fastify';

type Context<TService> = {
  route: string;
  fastify: FastifyInstance;
  service: TService;
};

export type RegisterEndpoint<TService> = (context: Context<TService>) => void;
