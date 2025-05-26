import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

import { gqlContext } from '../types/types.js';

interface ProfileModel {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

const profileType = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: GraphQLID },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLID },
  }),
});

const createProfileTypeDto = new GraphQLInputObjectType({
  name: 'createProfileInputTypeDto',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLID },
  }),
});

const updateProfileTypeDto = new GraphQLInputObjectType({
  name: 'updateProfileInputTypeDto',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLID },
  }),
});

const profilesQuery = {
  type: new GraphQLList(profileType),
  resolve: async (_, __, context: gqlContext) => {
    return await context.prisma.profile.findMany();
  },
};

const profileQuery = {
  type: profileType,
  args: { id: { type: GraphQLID } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const { id } = args;

    const profile = await context.prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (profile === null) {
      throw context.httpErrors.notFound();
    }

    return profile;
  },
};

const profileCreate = {
  type: profileType,
  args: {
    data: {
      type: createProfileTypeDto,
    },
  },
  resolve: async (
    _,
    args: {
      data: ProfileModel;
    },
    context: gqlContext,
  ) => {
    return context.prisma.profile.create({ data: args.data });
  },
};

const profileUpdate = {
  type: profileType,
  args: {
    id: { type: GraphQLID },
    data: {
      type: updateProfileTypeDto,
    },
  },
  resolve: async (
    _,
    args: {
      id: string;
      data: ProfileModel;
    },
    context: gqlContext,
  ) => {
    const { id, data } = args;

    const profileToUpdate = await context.prisma.profile.findUnique({
      where: { id },
    });

    if (!profileToUpdate) {
      throw context.httpErrors.notFound();
    }

    return context.prisma.profile.update({ where: { id }, data: data });
  },
};

const profileDelete = {
  type: profileType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const id = args.id;

    return context.prisma.profile.delete({ where: { id } });
  },
};

export { profileCreate, profileDelete, profileQuery, profilesQuery, profileUpdate };
