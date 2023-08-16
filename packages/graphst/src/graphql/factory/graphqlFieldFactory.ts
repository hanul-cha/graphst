import {
  GraphQLFieldConfigMap,
  GraphQLInputType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLOutputType,
  GraphQLType,
  Thunk,
} from 'graphql';
import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlCusComType } from '../../metadata/interfaces';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { MiddlewareClass, Middleware } from '../../middleware/middleware';
import { getObjectSchema } from '../utile/getObjectSchema';

interface FieldProp {
  name: string | symbol;
  originalName?: string | symbol;
  resolver?: Function;
  returnType: () => GraphQLOutputType | Function;
  fn?: Function;
  args?: {
    [key: string]: () => GraphQLInputType;
  };
  description?: string;
  middlewares?: MiddlewareClass[];
}

@Injectable()
export class GraphqlFieldFactory {
  @Inject(() => Middleware)
  private middleware!: Middleware;

  private storage = MetadataStorage.getStorage();

  getSchema(
    props: Omit<FieldProp, 'fn' | 'middlewares' | 'originalName' | 'resolver'>[]
  ) {
    const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};

    props.forEach(({ name, returnType, args, description }) => {
      const methodName = typeof name === 'symbol' ? name.toString() : name;
      const filedArg: { [key: string]: { type: GraphQLInputType } } = {};
      const argsEntries = args ? Object.entries(args) : [];

      argsEntries.forEach(([key, graphQLInput]) => {
        const argReturn = graphQLInput();
        this.storage.setGraphqlCustomType(this.extractInnerType(argReturn));
        filedArg[key] = { type: argReturn };
      });

      let returnTypeValue = returnType();

      if (returnTypeValue instanceof Function) {
        returnTypeValue = getObjectSchema(returnTypeValue);
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

    return Object.keys(fields).length > 0 ? fields : undefined;
  }

  getMethod(props: Omit<FieldProp, 'returnType' | 'args' | 'description'>[]) {
    const resolverMethods: { [key: string]: Function } = {};

    props.forEach(({ name, fn, middlewares, originalName, resolver }) => {
      const methodName = typeof name === 'symbol' ? name.toString() : name;

      if (fn) {
        resolverMethods[methodName] = (
          parent: any,
          args: any,
          context: any,
          info: any
        ) =>
          this.middleware.execute(
            {
              parent,
              args,
              context,
              info,
            },
            [...this.storage.getGlobalMiddlewares(), ...(middlewares ?? [])],
            fn,
            resolver,
            originalName
          );
      }
    });

    return Object.keys(resolverMethods).length > 0
      ? resolverMethods
      : undefined;
  }

  extractInnerType(type: GraphQLType): GraphqlCusComType {
    if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
      return this.extractInnerType(type.ofType);
    }
    return type;
  }
}
