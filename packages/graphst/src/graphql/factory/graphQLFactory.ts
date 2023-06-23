import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, printSchema } from 'graphql';
import { gql } from 'graphql-tag';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlMethod } from '../../interfaces/type';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlMethodFactory } from './graphqlMethodFactory';
import { GraphqlObjectFactory } from './graphqlObjectFactory';

@Injectable()
export class GraphqlFactory {
  private storage = MetadataStorage.getStorage();
  private graphqlSchema: GraphQLSchema | null = null;

  @Inject(() => GraphqlObjectFactory)
  objectFactory!: GraphqlObjectFactory;

  @Inject(() => GraphqlMethodFactory)
  methodFactory!: GraphqlMethodFactory;

  generate() {
    // 무조건 첫순서여야함 -> objectFactory에서 만든 Graphql타입을 query, mutation에서 사용할 수 있음
    const object = this.objectFactory.generate();
    const mutation = this.methodFactory.generate(GraphqlMethod.MUTATION);
    const query = this.methodFactory.generate(GraphqlMethod.QUERY);

    const schema = new GraphQLSchema({
      mutation: mutation.schemes[0] ?? null,
      query: query.schemes[0] ?? null,
      types: [...object.schemes, ...this.storage.getGraphqlCustomTypeAll()],
    });

    this.graphqlSchema = schema;

    const resolvers = Object.assign(
      {},
      ...(mutation.resolvers ? [mutation.resolvers] : []),
      ...(query.resolvers ? [query.resolvers] : []),
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
