import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema, printSchema } from 'graphql';
import { gql } from 'graphql-tag';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlMethod } from '../types';
import { GraphqlMethodFactory } from './graphqlMethodFactory';
import { GraphqlObjectFactory } from './graphqlObjectFactory';

@Injectable()
export class GraphqlFactory {
  private storage = MetadataStorage.getStorage();
  private graphqlSchema: string | null = null;

  @Inject(() => GraphqlObjectFactory)
  objectFactory!: GraphqlObjectFactory;

  @Inject(() => GraphqlMethodFactory)
  methodFactory!: GraphqlMethodFactory;

  generate() {
    const object = this.objectFactory.generate();
    const mutation = this.methodFactory.generate(GraphqlMethod.MUTATION);
    const query = this.methodFactory.generate(GraphqlMethod.QUERY);

    const schema = new GraphQLSchema({
      mutation: mutation.schemes[0] ?? null,
      query: query.schemes[0] ?? null,
      types: [...object.schemes, ...this.storage.getGraphqlCustomTypeAll()],
    });

    this.graphqlSchema = printSchema(schema)
      .split('\n')
      .filter((line) => {
        const trimmedLine = line.trim();
        return !(
          trimmedLine.startsWith('type') && trimmedLine.endsWith('__copy')
        );
      })
      .join('\n')
      .replace(/__copy/g, '');

    const resolvers = Object.assign(
      {},
      ...(mutation.resolvers ? [mutation.resolvers] : []),
      ...(query.resolvers ? [query.resolvers] : []),
      object.resolvers
    );

    const schemas = makeExecutableSchema({
      typeDefs: gql`
        ${this.graphqlSchema}
      `,
      resolvers,
    });

    return schemas;
  }

  getSchema() {
    return this.graphqlSchema;
  }
}
