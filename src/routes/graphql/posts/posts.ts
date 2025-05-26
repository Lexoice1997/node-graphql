import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { gqlContext } from '../types/types.js';

interface PostModel {
  id?: string;
  title: string;
  content: string;
  authorId: string;
}

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
  resolve: async (_, __, context: gqlContext) => {
    return await context.prisma.post.findMany();
  },
};

const postQuery = {
  type: postType,
  args: { id: { type: GraphQLID } },
  resolve: async (_, { id }: { id: string }, context: gqlContext) => {
    const post = await context.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post === null) {
      throw context.httpErrors.notFound();
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
  resolve: async (_, args: { data: PostModel }, context: gqlContext) => {
    return context.prisma.post.create({ data: args.data });
  },
};

const postUpdate = {
  type: postType,
  args: {
    data: {
      type: updatePostTypeDto,
    },
  },
  resolve: async (_, args: { data: PostModel }, context: gqlContext) => {
    const id = args.data.id;

    const post = await context.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw context.httpErrors.notFound();
    }

    return context.prisma.post.update({ where: { id: id }, data: args.data });
  },
};

const postDelete = {
  type: postType,
  args: { id: { type: GraphQLID } },
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const id = args.id;

    const post = await context.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw context.httpErrors.notFound();
    }

    return context.prisma.post.delete({ where: { id: id } });
  },
};

export { postCreate, postDelete, postQuery, postsQuery, postUpdate };
