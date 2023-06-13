import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { GraphqlGenerateFactory, ResolverValue } from '../types';
import { FieldFactory } from './fieldFactory';

@Injectable()
export class GraphqlObjectFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();

  @Inject(() => FieldFactory)
  fieldFactory!: FieldFactory;

  generate() {
    const schemes = [] as GraphQLNamedType[];
    const resolvers: {
      [key: string]: ResolverValue;
    } = {};

    // TODO: target이 GraphqlObject일 때 처리 필요
    const fieldResolvers = this.storage
      .getFieldResolverAll()
      .map((resolver) => ({
        ...resolver,
        target: resolver.target(),
      }));

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
