import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import {
  FieldResolverMetadata,
  FieldTypeMetadata,
} from '../../metadata/interfaces';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { ResolverValue } from '../types';
import { GraphqlFieldFactory } from './graphqlFieldFactory';

@Injectable()
export class GraphqlObjectFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => GraphqlFieldFactory)
  fieldFactory!: GraphqlFieldFactory;

  generate() {
    const schemes = [] as GraphQLNamedType[];
    const resolvers: {
      [key: string]: ResolverValue;
    } = {};

    const objects = this.storage.getObjectTypeAll();

    objects.forEach(({ target, name }) => {
      const fieldResolver = this.storage.getFieldResolvers(target);

      const method = this.fieldFactory.getMethod(fieldResolver);

      const graphqlEntity = this.getEntityGraphqlType(target, name, [
        ...this.storage.getFields(target),
        ...fieldResolver,
      ]);
      if (graphqlEntity) {
        schemes.push(graphqlEntity);
      }

      if (method) {
        resolvers[name] = method;
      }
    });

    return {
      schemes,
      resolvers,
    };
  }

  getEntityGraphqlType(
    target: Function,
    name: string,
    fieldDatas: (FieldResolverMetadata | FieldTypeMetadata)[]
  ) {
    let graphqlEntity = this.storage.getGeneratedGraphqlObjectType(target);

    if (!graphqlEntity) {
      const fields = this.fieldFactory.getSchema(fieldDatas);
      if (fields) {
        graphqlEntity = new GraphQLObjectType({
          name,
          fields,
        });
        this.storage.setGeneratedGraphqlObjectType(target, graphqlEntity);
      }
    }

    return graphqlEntity;
  }
}
