import { GraphQLObjectType } from 'graphql';
import { Container } from '../../container';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlGenerateFactory } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlQueryFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();
  private container = Container;

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const resolvers = this.storage.getResolverAll();
    const queries = this.storage.getGraphqlMethod('Query');

    const filteredQueries = resolvers.flatMap(({ target, middlewares }) =>
      queries
        .filter(({ resolver }) => resolver === target)
        .map((item) => {
          const resolverInstance = this.container.getProvider(item.resolver);
          const fn = resolverInstance
            ? item.fn.bind(resolverInstance)
            : item.fn;

          return {
            ...item,
            middlewares: [...(middlewares ?? []), ...(item.middlewares ?? [])],
            fn,
          };
        })
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
