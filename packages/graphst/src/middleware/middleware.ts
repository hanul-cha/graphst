import { IncomingMessage } from 'node:http';
import { Container } from '../container';

export type GraphstProps = {
  parent: any;
  args: any;
  context: {
    req: IncomingMessage;
    [key: string]: any;
  };
  info: any;
};

export interface MiddlewareInterface {
  handle(
    context: GraphstProps,
    next: (context?: GraphstProps) => void
  ): void | Promise<void>;
}

export type MiddlewareClass = new () => MiddlewareInterface;

export async function middlewareExecute(
  context: GraphstProps,
  middlewares: MiddlewareClass[],
  resolver: Function
) {
  if (middlewares.length > 0) {
    const [middleware, ...nextMiddlewares] = middlewares;
    const middlewareInstance =
      Container.getProvider(middleware) ?? new middleware();
    return await middlewareInstance.handle(context, (handlerContext) =>
      middlewareExecute(handlerContext ?? context, nextMiddlewares, resolver)
    );
  }
  return resolver(context.parent, context.args, context.context, context.info);
}
