import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphqlMethod } from '../interfaces/type';
import { MetadataStorage } from '../metadata/metadataStorage';
import { MiddlewareClass } from '../middleware/middleware';

export function Query(option: {
  returnType: () => GraphQLOutputType | Function;
  args?: Record<string, () => GraphQLInputType>;
  name?: string;
  description?: string;
  middlewares?: MiddlewareClass[];
}): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const _target = target.constructor;
    const originalMethod = descriptor.value;
    const storage = MetadataStorage.getStorage();

    storage.setGraphqlMethod(GraphqlMethod.QUERY, {
      target: GraphqlMethod.QUERY,
      resolver: _target,
      fn: originalMethod,
      name: option.name || propertyKey,
      returnType: option.returnType,
      args: option.args,
      description: option.description,
      middlewares: option.middlewares,
    });
  };
}
