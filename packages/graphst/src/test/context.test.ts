import { GraphQLInt, GraphQLString } from 'graphql';
import { Query } from '../decorators/query.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Field } from '../decorators/field.decorators';
import { GraphstServer } from '../server';
import { Resolver } from '../decorators/resolver.decorators';
import { sendGraphQLRequest } from './utile';
import { GraphstContext } from '../context/GraphstContext';
import { IncomingMessage } from 'http';

describe('graphst, context.test', () => {
  let server;

  @ObjectType()
  class Project {
    @Field({
      returnType: () => GraphQLInt,
    })
    id!: number;

    @Field({
      returnType: () => GraphQLString,
    })
    name!: string;
  }

  @Resolver(() => Project)
  class ProjectResolver {
    @Query({
      returnType: () => GraphQLString,
    })
    getToken(_: null, __: null, context: any): string {
      return context.token;
    }
  }

  class AuthTokenContext implements GraphstContext {
    result(req: IncomingMessage) {
      return req.headers.authorization;
    }
  }

  beforeAll(() => {
    server = new GraphstServer({
      context: {
        token: AuthTokenContext,
      },
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
      getToken
    }
    `;

    const token = 'Bearer text token';

    const response = await sendGraphQLRequest(query, undefined, token);

    expect(response.data.getToken).toEqual(token);
    // expect(response.data.getProject.hasProject).toEqual(true);
  });
});
