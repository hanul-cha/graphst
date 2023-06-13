import { FieldResolver } from '../decorators/fieldResolver.decorators';
import {
  GraphQLBoolean,
  GraphQLID,
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

describe('graphst, Query', () => {
  let server;

  @ObjectType()
  class Project {
    @Field(() => GraphQLID)
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
      if ((args.keys ?? []).length > 0) {
        return true;
      }
      return false;
    }

    @Query({
      args: {
        id: () => GraphQLInt,
      },
      returnType: () => GraphQLInt,
    })
    projectAll(
      _: null,
      args: {
        id: number;
      }
    ): number {
      if (args.id > 0) {
        return 0;
      }
      return 1;
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
      console.log('Server start');
    });
  });

  afterAll(() => {
    server.stop();
  });

  test('Query Test', async () => {
    const query = `
      query {
        // 쿼리 내용
      }
    `;

    // GraphQL 요청을 보내고 응답을 받습니다.
    // const response = await sendGraphQLRequest(query);

    // 응답에 대한 검증을 수행합니다.
    expect(1).toEqual(1);
  });
});
