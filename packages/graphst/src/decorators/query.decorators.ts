import { ReturnTypeFunc } from '../interfaces/type';

export function Query(
  nameOrType?: string | ReturnTypeFunc,
  options?: any
): MethodDecorator {
  return <T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) => {
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);
  };
}
