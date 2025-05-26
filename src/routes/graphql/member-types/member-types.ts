import {
  GraphQLEnumType,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import { MemberTypeId } from '../../member-types/schemas.js';
import { gqlContext } from '../types/types.js';

const memberType = new GraphQLObjectType({
  name: 'memberTyoe',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const memberTypesQuery = {
  type: new GraphQLList(memberType),
  resolve: async (_, __, context: gqlContext) => {
    return await context.prisma.memberType.findMany();
  },
};

const memberTypeQuery = {
  type: memberType,
  args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
  resolve: async (_, args: { id: MemberTypeId }, context: gqlContext) => {
    const memberType = await context.prisma.memberType.findUnique({
      where: {
        id: args.id,
      },
    });

    if (memberType === null) {
      throw context.httpErrors.notFound();
    }

    return memberType;
  },
};

export { memberTypeQuery, memberTypesQuery };
