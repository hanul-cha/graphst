import { GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlGenerateFactory } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlQueryFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const resolvers = this.storage.getResolverAll();
    const queries = this.storage.getGraphqlMethod('Query');

    const filteredQueries = resolvers.flatMap(({ target, middlewares }) =>
      queries
        .filter(({ resolver }) => resolver === target)
        .map((item) => ({
          ...item,
          middlewares: [...(middlewares ?? []), ...(item.middlewares ?? [])],
        }))
    );

    const queryMethod = this.fieldFactory.getMethod(filteredQueries);

    return {
      schemes: queryMethod.fields
        ? [
            new GraphQLObjectType({
              name: 'Query',
              fields: queryMethod.fields,
            }),
          ]
        : [],
      resolvers: queryMethod.resolverMethods
        ? { Query: queryMethod.resolverMethods }
        : null,
    };
  }
}
