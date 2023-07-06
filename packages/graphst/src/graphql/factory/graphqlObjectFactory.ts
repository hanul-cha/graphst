import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
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

    // TODO: target이 GraphqlObject일 때 처리 필요
    const fieldResolvers = this.storage
      .getFieldResolverAll()
      .map((resolver) =>
        this.fieldFactory.bindResolver(resolver, {
          target: () => resolver.target(),
        })
      )
      .filter(({ resolver }) => this.storage.getResolverByTarget(resolver));

    const objects = this.storage.getObjectTypeAll();

    objects.forEach(({ target, name }) => {
      const fieldProps = [
        ...this.storage.getFields(target),
        ...fieldResolvers.filter((resolver) => resolver.target === target),
      ];

      const method = this.fieldFactory.getMethod(fieldProps);
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
        schemes.push(graphqlEntity);
        // TODO: delete
        this.storage.setGraphqlEntityType(target, graphqlEntity);
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
}
