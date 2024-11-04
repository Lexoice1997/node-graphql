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

const updatePostTypeDto = new GraphQLInputObjectType({
  name: 'updatePostInputTypeDto',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const postsQuery = {
  type: new GraphQLList(postType),
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.fastify.db.post.findMany();
  },
};

const postQuery = {
  type: postType,
  args: { id: { type: GraphQLID } },
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
    return context.fastify.db.post.create(args.data);
  },
};

const postUpdate = {
  type: postType,
  args: {
    data: {
      type: updatePostTypeDto,
    },
  },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const id = args.data.id;

    const post = await context.fastify.db.post.findOne({
      key: 'id',
      equals: id,
    });

    if (!post) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.post.update(id, args.data);
  },
};

const postDelete = {
  type: postType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const id = args.id;

    const post = await context.fastify.db.posts.findOne({
      key: 'id',
      equals: id,
    });

    if (!post) {
      throw context.fastify.httpErrors.notFound();
    }

    return context.fastify.db.post.delete(id);
  },
};

export { postCreate, postDelete, postQuery, postUpdate, postsQuery };
