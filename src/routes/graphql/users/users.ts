import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { gqlContext } from '../types/types.js';

const userType = new GraphQLObjectType({
  name: 'user',
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
    id: { type: GraphQLID },
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
      type: createUserTypeDto,
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
    data: {
      type: updateUserTypeDto,
    },
  },
  resolve: async (
    _,
    args: { data: { id: string; name: string; balance: number } },
    context: gqlContext,
  ) => {
    const id = args.data.id;

    const user = await context.prisma.user.findUnique({
      where: { id },
    });

    if (user === null) {
      throw context.httpErrors.notFound();
    }

    return context.prisma.user.update({ where: { id }, data: args.data });
  },
};

const userDelete = {
  type: userType,
  args: { id: { type: GraphQLID } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const id = args.id;

    const user = await context.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user === null) {
      throw context.httpErrors.notFound();
    }

    return context.prisma.user.delete({ where: { id } });
  },
};

export { userCreate, userDelete, userQuery, usersQuery, userUpdate };
