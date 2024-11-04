import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';

const memberType = new GraphQLObjectType({
  name: 'memberTyoe',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const memberTypesQuery = {
  type: new GraphQLList(memberType),
  resolve: async (parent: any, args: any, context: any, info: any) => {
    return await context.fastify.db.memberType.findMany();
  },
};

const memberTypeQuery = {
  type: memberType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const memberType = await context.fastify.db.memberType.findOne({
      where: {
        key: 'id',
        equals: args.id,
      },
    });

    if (memberType === null) {
      throw context.fastify.httpErrors.notFound();
    }

    return memberType;
  },
};

export { memberTypeQuery, memberTypesQuery };
