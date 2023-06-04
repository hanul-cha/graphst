import { GraphqlFactory } from './factory/graphqlFactory';
import { GraphqlQueryFactory } from './factory/graphqlQueryFactory';
import { GraphqlObjectFactory } from './factory/graphqlObjectFactory';
import { GraphqlMutationFactory } from './factory/graphqlMutationFactory';
import { FieldFactory } from './factory/fieldFactory';

export const graphqlInjectList = [
  GraphqlFactory,
  GraphqlObjectFactory,
  GraphqlQueryFactory,
  GraphqlMutationFactory,
  FieldFactory,
];
