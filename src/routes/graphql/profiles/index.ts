import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.fastify.db.profile.findMany();
  },
};

const profileQuery = {
  type: profileType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const profile = await context.fastify.db.profile.findOne({
      where: {
        key: 'id',
        equals: args.id,
      },
    });

    if (profile === null) {
      throw context.fastify.httpErrors.notFound();
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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return context.fastify.db.user.create(args.data);
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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const { id, data } = args,
      profileToUpdate = await context.fastify.db.profiles.findOne({
        key: 'id',
        equals: id,
      });

    if (!profileToUpdate) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.profiles.change(id, data);
  },
};

const profileDelete = {
  type: profileType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return context.fastify.db.profiles.delete(args.id);
  },
};

export { profileCreate, profileDelete, profileQuery, profileUpdate, profilesQuery };
