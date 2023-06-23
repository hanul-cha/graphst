import { GraphQLObjectType } from 'graphql';
import { Container } from '../../container';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlMethod } from '../../interfaces/type';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlFieldFactory } from './graphqlFieldFactory';

@Injectable()
export class GraphqlMethodFactory {
  private storage = MetadataStorage.getStorage();
  private container = Container;

  @Inject(() => GraphqlFieldFactory)
  fieldFactory!: GraphqlFieldFactory;

  generate(graphqlMethod: GraphqlMethod) {
    const resolvers = this.storage.getResolverAll();
    const methods = this.storage.getGraphqlMethod(graphqlMethod);

    const filteredQueries = resolvers.flatMap(({ target, middlewares }) =>
      methods
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

    const method = this.fieldFactory.getMethod(filteredQueries);

    return {
      schemes: method.fields
        ? [
            new GraphQLObjectType({
              name: graphqlMethod,
              fields: method.fields,
            }),
          ]
        : [],
      resolvers: method.resolverMethods
        ? { [graphqlMethod]: method.resolverMethods }
        : null,
    };
  }
}
