import { GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlMethod } from '../../interfaces/type';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlFieldFactory } from './graphqlFieldFactory';

@Injectable()
export class GraphqlMethodFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => GraphqlFieldFactory)
  fieldFactory!: GraphqlFieldFactory;

  generate(graphqlMethod: GraphqlMethod) {
    const resolvers = this.storage.getResolverAll();
    const methods = this.storage.getGraphqlMethod(graphqlMethod);

    const filteredQueries = resolvers.flatMap(({ target, middlewares }) =>
      methods
        .filter(({ resolver }) => resolver === target)
        .map((item) =>
          this.fieldFactory.resolverBind(item, {
            middlewares: () => [
              ...(middlewares ?? []),
              ...(item.middlewares ?? []),
            ],
          })
        )
    );

    const method = this.fieldFactory.getMethod(filteredQueries);
    const schema = this.fieldFactory.getSchema(filteredQueries);

    return {
      schemes: schema
        ? [
            new GraphQLObjectType({
              name: graphqlMethod,
              fields: schema,
            }),
          ]
        : [],
      resolvers: method ? { [graphqlMethod]: method } : null,
    };
  }
}
