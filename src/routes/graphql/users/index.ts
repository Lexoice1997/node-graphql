import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.fastify.db.user.findMany();
  },
};

const userQuery = {
  type: userType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const user = await context.fastify.db.user.findOne({
      where: {
        key: 'id',
        equals: args.id,
      },
    });

    if (user === null) {
      throw context.fastify.httpErrors.notFound();
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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return context.fastify.db.user.create(args.data);
  },
};

const userUpdate = {
  type: userType,
  args: {
    data: {
      type: updateUserTypeDto,
    },
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const id = args.data.id;

    const user = await context.fastify.db.user.findOne({
      key: 'id',
      equals: id,
    });

    if (user === null) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.user.update(id, args.data);
  },
};

const userDelete = {
  type: userType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const id = args.data.id;

    const user = await context.fastify.db.user.findOne({
      key: 'id',
      equals: id,
    });

    if (user === null) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.user.delete(id);
  },
};

export { userCreate, userDelete, userQuery, userUpdate, usersQuery };
