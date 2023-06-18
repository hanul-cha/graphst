import { GraphQLObjectType } from 'graphql';
import { Container } from '../../container';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlGenerateFactory } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlMutationFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();
  private container = Container;

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const resolvers = this.storage.getResolverAll();
    const mutations = this.storage.getGraphqlMethod('Mutation');

    const filteredMutations = resolvers.flatMap(({ target, middlewares }) =>
      mutations
        .filter(({ resolver }) => resolver === target)
        .map((item) => ({
          ...item,
          middlewares: [...(middlewares ?? []), ...(item.middlewares ?? [])],
          fn: item.fn.bind(this.container.getProvider(item.resolver)),
        }))
    );

    const mutationMethod = this.fieldFactory.getMethod(filteredMutations);

    return {
      schemes: mutationMethod.fields
        ? [
            new GraphQLObjectType({
              name: 'Mutation',
              fields: mutationMethod.fields,
            }),
          ]
        : [],
      resolvers: mutationMethod.resolverMethods
        ? { Mutation: mutationMethod.resolverMethods }
        : null,
    };
  }
}
