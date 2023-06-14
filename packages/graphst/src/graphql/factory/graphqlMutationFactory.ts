import { GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { GraphqlGenerateFactory } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlMutationFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const resolvers = this.storage.getResolverAll();
    const mutations = this.storage.getGraphqlMethod('Mutation');

    //TODO: resolver 단위의 middleware 처리
    const filteredMutations = resolvers.flatMap(({ target }) =>
      mutations.filter(({ resolver }) => resolver === target)
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
      resolvers: { Mutation: mutationMethod.resolverMethods ?? {} },
    };
  }
}
