import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

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
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const userPosts = await context.fastify.db.post.findOne({
      where: {
        key: 'authorId',
        equals: args.id,
      },
    });

    if (userPosts === null) {
      throw context.fastify.httpErrors.notFound();
    }

    return userPosts;
  },
};

export { userPostsQuery };
