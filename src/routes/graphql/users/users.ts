import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { gqlContext } from '../types/types.js';
import { UUIDType } from '../types/uuid.js';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const createUserTypeDto = new GraphQLInputObjectType({
  name: 'createUserInputTypeDto',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const updateUserTypeDto = new GraphQLInputObjectType({
  name: 'updateUserInputTypeDto',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const usersQuery = {
  type: new GraphQLList(userType),
  resolve: async (_, __, context: gqlContext) => {
    return await context.prisma.user.findMany();
  },
};

const userQuery = {
  type: userType,
  args: { id: { type: GraphQLID } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const user = await context.prisma.user.findUnique({
      where: {
        id: args.id,
      },
    });

    if (user === null) {
      throw context.httpErrors.notFound();
    }

    return user;
  },
};

const userCreate = {
  type: userType,
  args: {
    data: {
      type: new GraphQLNonNull(createUserTypeDto),
    },
  },
  resolve: async (
    _,
    args: { data: { name: string; balance: number } },
    context: gqlContext,
  ) => {
    return context.prisma.user.create({ data: args.data });
  },
};

const userUpdate = {
  type: userType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    data: {
      type: new GraphQLNonNull(updateUserTypeDto),
    },
  },
  resolve: async (
    _,
    args: { id: string; data: { name: string; balance: number } },
    context: gqlContext,
  ) => {
    const { id, data } = args;

    return context.prisma.user.update({ where: { id }, data });
  },
};

const userDelete = {
  type: userType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const { id } = args;

    await context.prisma.user.delete({ where: { id } });

    return true;
  },
};

export { userCreate, userDelete, userQuery, usersQuery, userUpdate };
