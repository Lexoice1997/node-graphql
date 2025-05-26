import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { gqlContext } from '../types/types.js';

const userPostsType = new GraphQLObjectType({
  name: 'userPosts',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLID },
  }),
});

const userPostsQuery = {
  type: new GraphQLList(userPostsType),
  args: { id: { type: GraphQLID } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const userPosts = await context.prisma.post.findUnique({
      where: {
        id: args.id,
      },
    });

    if (userPosts === null) {
      throw context.httpErrors.notFound();
    }

    return userPosts;
  },
};

export { userPostsQuery };
