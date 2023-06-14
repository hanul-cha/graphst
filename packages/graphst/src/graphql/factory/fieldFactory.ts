import {
  GraphQLFieldConfigMap,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLType,
  Thunk,
} from 'graphql';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlCusComType } from '../../metadata/interfaces';
import { MetadataStorage } from '../../metadata/MetadataStorage';

@Injectable()
export class FieldFactory {
  private storage = MetadataStorage.getStorage();

  getMethod(
    props: {
      name: string | symbol;
      returnType: () => GraphQLOutputType | Function;
      fn?: Function;
      args?: {
        [key: string]: () => GraphQLInputType;
      };
      description?: string;
    }[]
  ) {
    const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};
    const resolverMethods: { [key: string]: Function } = {};

    props.forEach(({ name, returnType, fn, args, description }) => {
      const methodName = typeof name === 'symbol' ? name.toString() : name;
      const filedArg: { [key: string]: { type: any } } = {};
      const argsEntries = args ? Object.entries(args) : [];

      argsEntries.forEach(([key, graphQLInput]) => {
        const argReturn = graphQLInput();
        this.storage.setGraphqlCustomType(this.extractInnerType(argReturn));
        filedArg[key] = { type: argReturn };
      });

      if (fn) {
        resolverMethods[methodName] = fn;
      }

      let returnTypeValue = returnType();

      if (returnTypeValue instanceof Function) {
        returnTypeValue = this.getEntityGraphqlType(returnTypeValue);
      } else {
        this.storage.setGraphqlCustomType(
          this.extractInnerType(returnTypeValue)
        );
      }

      fields[methodName] = {
        type: returnTypeValue,
        description,
        ...(argsEntries.length > 0 ? { args: filedArg } : {}),
      };
    });

    return {
      fields: Object.keys(fields).length > 0 ? fields : undefined,
      resolverMethods:
        Object.keys(resolverMethods).length > 0 ? resolverMethods : undefined,
    };
  }

  getEntityGraphqlType(target: Function): GraphQLObjectType {
    const graphqlEntity = this.storage.getGraphqlEntityType(target);

    if (!graphqlEntity) {
      throw new Error(`Not found graphql entity type: ${target.name}`);
    }

    return graphqlEntity;
  }

  extractInnerType(type: GraphQLType): GraphqlCusComType {
    if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
      return this.extractInnerType(type.ofType);
    }
    return type;
  }
}
