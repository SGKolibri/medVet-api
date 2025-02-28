import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'node:http';
import { FastifyTypeProviderDefault } from 'fastify/types/type-provider';

declare module 'fastify' {
  export interface FastifyRequest {
    file?: {
      buffer: Buffer;
      mimetype: string;
      originalname?: string;
    };
  }
}