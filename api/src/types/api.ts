import { FastifyInstance } from 'fastify';

type Context = {
  route: string;
  fastify: FastifyInstance;
};

export type RegisterEndpoint = (context: Context) => void;
