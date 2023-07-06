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
import { Container } from '../../container';
import { Injectable } from '../../decorators/injectable.decorators';
import { GraphqlCusComType } from '../../metadata/interfaces';
import { MetadataStorage } from '../../metadata/metadataStorage';
import {
  MiddlewareClass,
  middlewareExecute,
} from '../../middleware/middleware';

interface FieldProp {
  name: string | symbol;
  returnType: () => GraphQLOutputType | Function;
  fn?: Function;
  args?: {
    [key: string]: () => GraphQLInputType;
  };
  description?: string;
  middlewares?: MiddlewareClass[];
}

interface BindResolverProp {
  fn: Function;
  resolver: Function;
}

@Injectable()
export class GraphqlFieldFactory {
  private storage = MetadataStorage.getStorage();
  private container = Container;

  bindResolver<
    U extends keyof O,
    F = any,
    O extends BindResolverProp = BindResolverProp
  >(
    prop: O,
    extraTask?: {
      [key in U]: (prop: BindResolverProp) => F;
    }
  ): O {
    const resolverInstance = this.container.getProvider(prop.resolver);
    const fn = resolverInstance ? prop.fn.bind(resolverInstance) : prop.fn;

    const result = {} as {
      [key in U]: F;
    };

    if (extraTask) {
      const entries = Object.entries(extraTask) as [
        U,
        (prop: BindResolverProp) => F
      ][];

      for (const [key, fn] of entries) {
        result[key] = fn(prop);
      }
    }

    return {
      ...prop,
      ...result,
      fn,
    };
  }

  getSchema(props: Omit<FieldProp, 'fn' | 'middlewares'>[]) {
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

    return Object.keys(fields).length > 0 ? fields : undefined;
  }

  getMethod(props: Omit<FieldProp, 'returnType' | 'args' | 'description'>[]) {
    const resolverMethods: { [key: string]: Function } = {};

    props.forEach(({ name, fn, middlewares }) => {
      const methodName = typeof name === 'symbol' ? name.toString() : name;

      if (fn) {
        resolverMethods[methodName] = (
          parent: any,
          args: any,
          context: any,
          info: any
        ) =>
          middlewareExecute(
            {
              parent,
              args,
              context,
              info,
            },
            [...this.storage.getGlobalMiddlewares(), ...(middlewares ?? [])],
            fn
          );
      }
    });

    return Object.keys(resolverMethods).length > 0
      ? resolverMethods
      : undefined;
  }

  getEntityGraphqlType(target: Function): GraphQLObjectType {
    // TODO: 여기서 재귀함수로 Object타입을 전부 만들고 storage에 저장해야함
    // 여기서 고려해야할점은 재귀트리를 탈 때 순환되는것을 끊어주어야함
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
