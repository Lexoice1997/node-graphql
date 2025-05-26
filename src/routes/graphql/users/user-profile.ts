import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType } from 'graphql';
import { gqlContext } from '../types/types.js';

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
  resolve: async (_, args: { id: string }, context: gqlContext) => {
    const profile = await context.prisma.profile.findUnique({
      where: {
        id: args.id,
      },
    });

    if (profile === null) {
      throw context.httpErrors.notFound();
    }

    return profile;
  },
};

export { userProfileQuery };
