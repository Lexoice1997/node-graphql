import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, graphql } from 'graphql';
import { memberTypeQuery, memberTypesQuery } from './memberTypes/index.js';
import {
  postCreate,
  postDelete,
  postQuery,
  postUpdate,
  postsQuery,
} from './posts/index.js';
import {
  profileCreate,
  profileDelete,
  profileQuery,
  profileUpdate,
  profilesQuery,
} from './profiles/index.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  userCreate,
  userDelete,
  userQuery,
  userUpdate,
  usersQuery,
} from './users/index.js';
import { userPostsQuery } from './users/posts.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      posts: postsQuery,
      post: postQuery,
      users: usersQuery,
      user: userQuery,
      profile: profileQuery,
      profiles: profilesQuery,
      memberType: memberTypeQuery,
      memberTypes: memberTypesQuery,
      userPosts: userPostsQuery
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'mutation',
    fields: () => ({
      createPost: postCreate,
      updatePost: postUpdate,
      deletePost: postDelete,
      createUser: userCreate,
      updateUser: userUpdate,
      deleteUser: userDelete,
      createProfile: profileCreate,
      updateProfile: profileUpdate,
      deleteProfile: profileDelete,
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
