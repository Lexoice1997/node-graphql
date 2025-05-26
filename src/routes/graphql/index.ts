import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema, graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { memberTypeQuery, memberTypesQuery } from './member-types/member-types.js';
import {
  postCreate,
  postDelete,
  postQuery,
  postUpdate,
  postsQuery,
} from './posts/posts.js';
import {
  profileCreate,
  profileDelete,
  profileQuery,
  profileUpdate,
  profilesQuery,
} from './profiles/profiles.js';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { userPostsQuery } from './users/user-posts.js';
import {
  userCreate,
  userDelete,
  userQuery,
  userUpdate,
  usersQuery,
} from './users/users.js';

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
      userPosts: userPostsQuery,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
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
  const { prisma, httpErrors } = fastify;

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

      const errors = validate(schema, parse(query), [depthLimit(5)]);
      if (errors.length > 0) return { errors };

      return await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: { prisma, httpErrors },
      });
    },
  });
};

export default plugin;
