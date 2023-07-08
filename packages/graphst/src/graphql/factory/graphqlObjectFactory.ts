import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import {
  FieldResolverTypeMetadata,
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

  // TODO: target이 GraphqlObject일 때 처리 필요
  resolverBind(target: Function) {
    return this.storage
      .getFieldResolvers(target)
      .map((resolver) =>
        this.fieldFactory.resolverBind(resolver, {
          target: () => resolver.target(),
        })
      )
      .filter(({ resolver }) => this.storage.getResolverByTarget(resolver));
  }

  generate() {
    const schemes = [] as GraphQLNamedType[];
    const resolvers: {
      [key: string]: ResolverValue;
    } = {};

    const objects = this.storage.getObjectTypeAll();

    objects.forEach(({ target, name }) => {
      const fieldProps = [
        ...this.storage.getFields(target),
        ...this.resolverBind(target),
      ];

      const method = this.fieldFactory.getMethod(fieldProps);

      const graphqlEntity = this.getEntityGraphqlType(target, name, fieldProps);
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
    fields?: (FieldResolverTypeMetadata | FieldTypeMetadata)[]
  ) {
    const fieldProps = fields ?? [
      ...this.storage.getFields(target),
      ...this.resolverBind(target),
    ];
    let graphqlEntity = this.storage.getGraphqlEntityType(target);

    if (!graphqlEntity) {
      const fields = this.fieldFactory.getSchema(fieldProps);
      if (fields) {
        graphqlEntity = new GraphQLObjectType({
          name,
          fields,
        });
      }
    }

    if (graphqlEntity) {
      this.storage.setGraphqlEntityType(target, graphqlEntity);
    }
    return graphqlEntity;
  }
}
