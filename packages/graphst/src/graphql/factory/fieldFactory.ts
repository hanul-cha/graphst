import {
  GraphQLFieldConfigMap,
  GraphQLInputType,
  GraphQLOutputType,
  Thunk,
} from 'graphql';
import { Injectable } from '../../decorators/injectable.decorators';

@Injectable()
export class FieldFactory {
  getMethod(
    props: {
      name: string | symbol;
      returnType: () => GraphQLOutputType;
      fn?: Function;
      args?: {
        [key: string]: () => GraphQLInputType;
      };
    }[]
  ) {
    const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};
    const resolverMethods = {};

    props.forEach(({ name, returnType, fn, args }) => {
      const methodName = typeof name === 'symbol' ? name.toString() : name;
      const filedArg = {};
      const argsEntries = args ? Object.entries(args) : [];

      argsEntries.forEach(([key, graphQLInput]) => {
        filedArg[key] = { type: graphQLInput() };
      });

      if (fn) {
        resolverMethods[methodName] = fn;
      }

      fields[methodName] = {
        type: returnType(),
        ...(argsEntries.length > 0 ? { args: filedArg } : {}),
      };
    });

    return {
      fields: Object.keys(fields).length > 0 ? fields : undefined,
      resolverMethods:
        Object.keys(resolverMethods).length > 0 ? resolverMethods : undefined,
    };
  }
}
