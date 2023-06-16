import { IncomingMessage } from 'node:http';
import { Injectable } from '../decorators/injectable.decorators';

export type MiddlewareContext = {
  req: IncomingMessage;
  [key: string]: any;
};

export abstract class MiddlewareClass {
  abstract handle(
    context: MiddlewareContext,
    next: (context: MiddlewareContext) => void
  ): void | Promise<void>;
}

/*
TODO
결국 resolver에만 필요한거다
getProject(...) {

}

getProject를 graphql엔진이 호출할 것임 거기에
밑에 있는걸 호출하게 하면되지
(...) => {
    const 미들웨어
    return resolver(...)
}
*/

export function resolver(parent: any, args: any, context: any, info: any) {
  return execute(middlewares, { parent, args, context, info }, resolver, lock);
}

export class GraphstMiddleware {
  async execute(
    middlewares: MiddlewareClass[],
    context: {
      parent: any;
      args: any;
      context: any;
      info: any;
    },
    resolver: any,
    done: () => Promise<any>
  ) {
    if (middlewares.length > 0) {
      const [middleware, ...nestMiddlewares] = middlewares;
      return Promise.resolve(
        await middleware.handle(context, (handlerContext) => {
          return this.execute(nestMiddlewares, handlerContext, resolver, done);
        })
      );
    } else {
      return done().then(() => resolver(...context));
    }
  }
}
