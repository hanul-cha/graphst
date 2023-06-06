import { GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { GraphqlGenerateFactory } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlQueryFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const queryMethod = this.fieldFactory.getMethod(
      this.storage.getGraphqlMethod('Query')
    );

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
        ? [{ Query: queryMethod.resolverMethods! }]
        : [],
    };
  }
}
