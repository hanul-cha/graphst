import {
  GraphQLFieldConfigMap,
  GraphQLNamedType,
  GraphQLObjectType,
  Thunk,
} from 'graphql';
import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { GraphqlGenerateFactory, ResolverValue } from '../graphqlFactoryType';

@Injectable()
export class GraphqlObjectFactory implements GraphqlGenerateFactory {
  private storage = MetadataStorage.getStorage();

  generateSchema() {
    const schemes = [] as GraphQLNamedType[];
    const resolvers = [] as ResolverValue[];

    this.storage.getObjectTypeAll().forEach(({ target, name }) => {
      const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};
      const resolverMethods = {};

      this.storage.getFields(target).forEach(({ name, returnType }) => {
        const stringName = typeof name === 'symbol' ? name.toString() : name;
        fields[stringName] = { type: returnType() };
      });

      this.storage
        .getFieldResolvers(target)
        .forEach(({ name, returnType, fn, args }) => {
          const stringName = typeof name === 'symbol' ? name.toString() : name;
          const filedArg = {};
          const argsEntries = args ? Object.entries(args) : [];

          argsEntries.forEach(([key, graphQLInput]) => {
            filedArg[key] = { type: graphQLInput() };
          });
          fields[stringName] = {
            type: returnType(),
            ...(argsEntries.length > 0 ? { args: filedArg } : {}),
          };

          resolverMethods[stringName] = fn;
        });

      schemes.push(
        new GraphQLObjectType({
          name,
          fields,
        })
      );

      resolvers.push({ [name]: resolverMethods });
    });

    return {
      schemes,
      resolvers,
    };
  }
}
