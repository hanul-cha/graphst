import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, printSchema } from 'graphql';
import { gql } from 'graphql-tag';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { GraphqlMutationFactory } from './graphqlMutationFactory';
import { GraphqlObjectFactory } from './graphqlObjectFactory';
import { GraphqlQueryFactory } from './graphqlQueryFactory';

@Injectable()
export class GraphqlFactory {
  private storage = MetadataStorage.getStorage();
  private graphqlSchema!: GraphQLSchema;

  @Inject(() => GraphqlObjectFactory)
  objectFactory!: GraphqlObjectFactory;

  @Inject(() => GraphqlQueryFactory)
  queryFactory!: GraphqlQueryFactory;

  @Inject(() => GraphqlMutationFactory)
  mutationFactory!: GraphqlMutationFactory;

  generate() {
    // 무조건 첫순서여야함 -> objectFactory에서 만든 Graphql타입을 query, mutation에서 사용할 수 있음
    const object = this.objectFactory.generate();
    const mutation = this.mutationFactory.generate();
    const query = this.queryFactory.generate();

    const schema = new GraphQLSchema({
      mutation: mutation.schemes[0],
      query: query.schemes[0],
      types: [...object.schemes, ...this.storage.getGraphqlCustomTypeAll()],
    });

    this.graphqlSchema = schema;

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

  getSchema() {
    return this.graphqlSchema;
  }
}
