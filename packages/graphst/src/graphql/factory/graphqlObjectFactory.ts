import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { Container } from '../../container';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { ResolverValue } from '../types';
import { GraphqlFieldFactory } from './graphqlFieldFactory';

@Injectable()
export class GraphqlObjectFactory {
  private storage = MetadataStorage.getStorage();
  private container = Container;

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
      .map((resolver) => {
        const resolverInstance = this.container.getProvider(resolver.resolver);
        const fn = resolverInstance
          ? resolver.fn.bind(resolverInstance)
          : resolver.fn;

        return {
          ...resolver,
          target: resolver.target(),
          fn,
        };
      })
      .filter(({ resolver }) => this.storage.getResolverByTarget(resolver));

    this.storage.getObjectTypeAll().forEach(({ target, name }) => {
      const objectMethod = this.fieldFactory.getMethod([
        ...this.storage.getFields(target),
        ...fieldResolvers.filter((resolver) => resolver.target === target),
      ]);

      if (objectMethod.fields) {
        const graphqlEntity = new GraphQLObjectType({
          name,
          fields: objectMethod.fields,
        });
        schemes.push(graphqlEntity);
        this.storage.setGraphqlEntityType(target, graphqlEntity);
      }

      if (objectMethod.resolverMethods) {
        resolvers[name] = objectMethod.resolverMethods;
      }
    });

    return {
      schemes,
      resolvers,
    };
  }
}
