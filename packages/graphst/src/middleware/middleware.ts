import { IncomingMessage } from 'node:http';

export type GraphstProps = {
  parent: any;
  args: any;
  info: any;
  context: {
    req: IncomingMessage;
    [key: string]: any;
  };
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
    return Promise.resolve(
      await new middleware().handle(context, (handlerContext) =>
        middlewareExecute(handlerContext ?? context, nextMiddlewares, resolver)
      )
    );
  }
  return resolver(context.parent, context.args, context.context, context.info);
}
