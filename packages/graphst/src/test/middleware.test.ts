import { GraphQLBoolean, GraphQLInt, GraphQLString } from 'graphql';
import { Query } from '../decorators/query.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Field } from '../decorators/field.decorators';
import { GraphstServer } from '../server';
import { Resolver } from '../decorators/resolver.decorators';
import { sendGraphQLRequest } from './utile';
import { MiddlewareInterface } from '../middleware/middleware';
import { Injectable } from '../decorators/injectable.decorators';
import { Inject } from '../decorators/inject.decorators';

const array = [] as string[];

class QueryMiddleware implements MiddlewareInterface {
  handle(props, next) {
    array.push('4');
    return next();
  }
}

@Injectable()
class TestClass {
  toTest() {
    return 'test success!!!!';
  }
}

@Injectable()
class AddRole implements MiddlewareInterface {
  @Inject(() => TestClass)
  testClass!: TestClass;

  handle(props, next) {
    console.log(this.testClass.toTest());
    array.push('1');
    return next({
      ...props,
      context: {
        ...props.context,
        authRole: ['admin'],
      },
    });
  }
}

function checkRole(role: string) {
  class RequireRole implements MiddlewareInterface {
    handle(props, next) {
      array.push('2');
      return next({
        ...props,
        context: {
          ...props.context,
          requireRole: role,
        },
      });
    }
  }

  class CheckRole implements MiddlewareInterface {
    handle(props, next) {
      array.push('3');
      if (props.context.authRole.includes(props.context.requireRole)) {
        return next();
      }

      throw new Error('Not Auth');
    }
  }

  return [RequireRole, CheckRole];
}

describe('graphst, middleware.test', () => {
  let server;

  @ObjectType()
  class Project2 {
    @Field({
      returnType: () => GraphQLInt,
    })
    id!: number;

    @Field({
      returnType: () => GraphQLString,
    })
    name!: string;
  }

  @Resolver({
    key: () => Project2,
    middlewares: checkRole('admin'),
  })
  class Project2Resolver {
    @Query({
      middlewares: [QueryMiddleware],
      returnType: () => GraphQLBoolean,
    })
    roleCheck(_: null, __: null, context: any) {
      array.push(context.requireRole);
      return true;
    }
  }

  beforeAll(() => {
    server = new GraphstServer({
      middlewares: [AddRole],
    });
    server.start(4000, () => {
      console.log('Server start 🕶️');
    });
  });

  afterAll(() => {
    server.stop();
  });

  test('set context test', async () => {
    const query = `
    query {
      roleCheck
    }
    `;

    const response = await sendGraphQLRequest(query, undefined);

    expect(response.data.roleCheck).toEqual(true);
    expect(array).toEqual(['1', '2', '3', '4', 'admin']);
  });
});
