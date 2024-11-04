import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const subscribeToUserType = new GraphQLObjectType({
  name: 'usersPost',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const subscribersQuery = {
  type: new GraphQLList(subscribeToUserType),
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const users = await context.fastify.db.post.findOne({
      where: {
        userSubscribeTo: {
          some: {
            key: 'authorId',
            equals: args.id,
          },
        },
      },
    });

    return users;
  },
};

export { subscribersQuery };
