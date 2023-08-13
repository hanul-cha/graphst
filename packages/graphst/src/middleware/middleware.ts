import { IncomingMessage } from 'node:http';
import { Container } from '../container';
import { Inject } from '../decorators/inject.decorators';
import { Injectable } from '../decorators/injectable.decorators';
import { GraphqlArgsFactory } from '../graphql/factory/graphqlArgsFactory';

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

@Injectable()
export class Middleware {
  @Inject(() => GraphqlArgsFactory)
  private argsFactory!: GraphqlArgsFactory;

  async execute(
    context: GraphstProps,
    middlewares: MiddlewareClass[],
    fn: Function,
    resolver?: Function,
    originalName?: string | symbol
  ) {
    if (middlewares.length > 0) {
      const [middleware, ...nextMiddlewares] = middlewares;
      const middlewareInstance =
        Container.getProvider(middleware) ?? new middleware();
      return await middlewareInstance.handle(context, (handlerContext) =>
        this.execute(
          handlerContext ?? context,
          nextMiddlewares,
          fn,
          resolver,
          originalName
        )
      );
    }
    return fn(
      ...this.argsFactory.setArgsOrder(context, resolver, originalName)
    );
  }
}
