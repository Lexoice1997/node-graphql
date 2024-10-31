import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const postType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const createPostTypeDto = new GraphQLInputObjectType({
  name: 'createPostInputTypeDto',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const postsQuery = {
  type: new GraphQLList(postType),
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.fastify.db.posts.findMany();
  },
};

const postQuery = {
  type: postType,
  args: { id: { type: GraphQLString } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const post = await context.fastify.db.post.findOne({
      where: {
        key: 'id',
        equals: args.id,
      },
    });
    if (post === null) {
      throw context.fastify.httpErrors.notFound();
    }
    return post;
  },
};

const postCreate = {
  type: postType,
  args: {
    data: {
      type: createPostTypeDto,
    },
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const post = await context.fastify.db.users.findOne({
      key: 'id',
      equals: args.data.userId,
    });

    if (!post) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.posts.create(args.data);
  },
};

export { postCreate, postQuery, postsQuery };
