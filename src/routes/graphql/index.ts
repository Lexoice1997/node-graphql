import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import { postCreate, postQuery, postsQuery } from './post/index.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      posts: postsQuery,
      post: postQuery,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
      createPost: postCreate,
    }),
  }),
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      return graphql({
        schema,
        source: String(query),
        variableValues: variables,
        contextValue: { fastify, dataloaders: new WeakMap() },
      });
    },
  });
};

export default plugin;
