import { FieldResolver } from '../decorators/fieldResolver.decorators';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import { Mutation } from '../decorators/mutation.decorators';
import { Query } from '../decorators/query.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Field } from '../decorators/field.decorators';
import { GraphstServer } from '../server';
import { Resolver } from '../decorators/resolver.decorators';
import { sendGraphQLRequest } from './utile';

describe('graphst, Query', () => {
  let server;

  @ObjectType()
  class Project {
    @Field(() => GraphQLInt)
    id!: number;

    @Field(() => GraphQLString)
    name!: string;
  }

  @Resolver(() => Project)
  class ProjectResolver {
    @FieldResolver({
      parent: () => Project,
      returnType: () => GraphQLBoolean,
      name: 'hasProject',
      args: {
        keys: () => GraphQLList(GraphQLInt),
      },
    })
    isProject(parent: Project, args: { keys?: number[] }): boolean {
      if ((args.keys ?? []).length > 0 && parent.id === 1) {
        return true;
      }
      return false;
    }

    @Query({
      returnType: () => Project,
    })
    getProject(): Project {
      return {
        id: 1,
        name: '테스트 프로젝트',
      };
    }

    @Mutation({
      args: {
        id: () => GraphQLInt,
      },
      returnType: () => GraphQLString,
    })
    setProject(
      _: null,
      args: {
        id: number;
      }
    ): string {
      if (args.id === 1) {
        return '테스트 프로젝트';
      }
      return '???';
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

  test('Query Test', async () => {
    const query = `
    query($keys: [Int]) {
      getProject {
        id
        hasProject(keys: $keys)
      }
    }
    `;

    const response = await sendGraphQLRequest(query, { keys: [1, 2, 3] });

    expect(response.data.getProject.id).toEqual(1);
    expect(response.data.getProject.hasProject).toEqual(true);
  });

  test('Mutation Test', async () => {
    const mutation = `
    mutation($id: Int!) {
      setProject(id: $id)
    }
    `;

    const response = await sendGraphQLRequest(mutation, { id: 1 });

    expect(response.data.setProject).toEqual('테스트 프로젝트');
  });
});
