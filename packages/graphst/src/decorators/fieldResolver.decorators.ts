import { GraphQLInputType, GraphQLOutputType } from 'graphql';
import { GraphQLEntityType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/metadataStorage';
import { MiddlewareClass } from '../middleware/middleware';

export function FieldResolver(options: {
  parent: () => GraphQLEntityType | Function;
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
    storage.setFieldResolver(options.parent, {
      target: options.parent,
      resolver: _target,
      name: options.name || propertyKey,
      fn: originalMethod,
      returnType: options.returnType,
      args: options.args,
      description: options.description,
      middlewares: options.middlewares,
    });
  };
}
