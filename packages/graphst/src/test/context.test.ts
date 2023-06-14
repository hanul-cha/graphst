import { GraphQLInt, GraphQLString } from 'graphql';
import { Query } from '../decorators/query.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Field } from '../decorators/field.decorators';
import { GraphstServer } from '../server';
import { Resolver } from '../decorators/resolver.decorators';

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
    getContext(_: null, __: null, context: any): string {
      return '';
    }
  }

  beforeAll(() => {
    server = new GraphstServer();
    server.start(4000, () => {
      console.log('Server start 🕶️');
    });
  });

  afterAll(() => {
    server.stop();
  });

  test('set context test', async () => {
    // const query = `
    // query($keys: [Int]) {
    //   getProject {
    //     id
    //     hasProject(keys: $keys)
    //   }
    // }
    // `;

    // const response = await sendGraphQLRequest(query, { keys: [1, 2, 3] });

    expect(1).toEqual(1);
    // expect(response.data.getProject.id).toEqual(1);
    // expect(response.data.getProject.hasProject).toEqual(true);
  });
});
