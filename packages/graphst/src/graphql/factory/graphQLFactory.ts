import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, printSchema } from 'graphql';
import { gql } from 'graphql-tag';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlMutationFactory } from './graphqlMutationFactory';
import { GraphqlObjectFactory } from './graphqlObjectFactory';
import { GraphqlQueryFactory } from './graphqlQueryFactory';

@Injectable()
export class GraphqlFactory {
  @Inject(() => GraphqlObjectFactory)
  objectFactory!: GraphqlObjectFactory;

  @Inject(() => GraphqlQueryFactory)
  queryFactory!: GraphqlQueryFactory;

  @Inject(() => GraphqlMutationFactory)
  mutationFactory!: GraphqlMutationFactory;

  generate() {
    const mutation = this.mutationFactory.generate();
    const query = this.queryFactory.generate();
    const object = this.objectFactory.generate();

    const schema = new GraphQLSchema({
      mutation: mutation.schemes[0],
      query: query.schemes[0],
      // TODO: 다른 커스텀 타입 추가
      types: [...object.schemes],
    });

    const resolvers = Object.assign(
      {},
      mutation.resolvers,
      query.resolvers,
      object.resolvers
    );

    const schemas = makeExecutableSchema({
      typeDefs: gql`
        ${printSchema(schema)}
      `,
      resolvers,
    });

    return schemas;
  }
}
