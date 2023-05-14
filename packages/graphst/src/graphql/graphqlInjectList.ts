import { GraphQLFactory } from './factory/graphQLFactory';
import { GraphQLResolverBuilder } from './factory/graphQLResolverBuilder';
import { GraphQLSchemaBuilder } from './factory/graphQLSchemaBuilder';
import { GraphqlTypeFactory } from './factory/schema/graphqlTypeFactory';

export const graphqlInjectList = [
  GraphqlTypeFactory,
  GraphQLFactory,
  GraphQLResolverBuilder,
  GraphQLSchemaBuilder,
];
