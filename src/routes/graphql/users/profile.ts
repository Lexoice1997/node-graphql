import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql';

const userProfileType = new GraphQLObjectType({
  name: 'usersPost',
  fields: () => ({
    id: { type: GraphQLID },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: GraphQLID },
    memberTypeId: { type: GraphQLID },
  }),
});

const userProfileQuery = {
  type: userProfileType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent: any, args: any, context: any, info: any) => {
    const profile = await context.fastify.db.profile.findOne({
      where: {
        key: 'userId',
        equals: args.id,
      },
    });

    if (profile === null) {
      throw context.fastify.httpErrors.notFound();
    }

    return profile;
  },
};

export { userProfileQuery };
