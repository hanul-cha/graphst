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
    const mutationMethod = this.fieldFactory.getMethod(
      this.storage.getGraphqlMethod('mutation')
    );

    return {
      schemes: mutationMethod.fields
        ? [
            new GraphQLObjectType({
              name: 'mutation',
              fields: mutationMethod.fields,
            }),
          ]
        : [],
      resolvers: mutationMethod.resolverMethods
        ? [mutationMethod.resolverMethods]
        : [],
    };
  }
}
