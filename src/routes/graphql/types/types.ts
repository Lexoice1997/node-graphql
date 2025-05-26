import { HttpErrors } from "@fastify/sensible";
import { PrismaClient } from "@prisma/client";

export type gqlContext = {
  prisma: PrismaClient;
  httpErrors: HttpErrors
  loaders: unknown
};