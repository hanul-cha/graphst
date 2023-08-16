import { Container } from '../../container';

interface BindResolverProp {
  fn: Function;
  resolver: Function;
}

export default function resolverBind<
  U extends keyof O,
  F = any,
  O extends BindResolverProp = BindResolverProp
>(
  prop: O,
  extraTask?: {
    [key in U]: (prop: BindResolverProp) => F;
  }
) {
  const resolverInstance = Container.getProvider(prop.resolver);
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
