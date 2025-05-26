import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { gqlContext } from '../types/types.js';

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
  resolve: async (
    _,
    args: { subscriberId: string; authorId: string },
    context: gqlContext,
  ) => {
    // const users = await context.prisma.subscribersOnAuthors.findUnique({
    //   where: {
    //     authorId: args.subscriberId,
    //   },
    // });

    return null;
  },
};

export { subscribersQuery };
