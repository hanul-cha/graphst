import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  printSchema,
} from 'graphql';
import { Container } from '../container';
import { Field } from '../decorators/field.decorators';
import { FieldResolver } from '../decorators/fieldResolver.decorators';
import { Mutation } from '../decorators/mutation.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Query } from '../decorators/query.decorators';
import { Resolver } from '../decorators/resolver.decorators';
import { GraphqlFactory } from '../graphql/factory/graphqlFactory';

describe('graphst, auto.type.test', () => {
  enum LogType {
    INFO = 'info',
    ERROR = 'error',
  }

  const GraphqlLogType = new GraphQLEnumType({
    name: 'LogType',
    values: {
      INFO: { value: LogType.INFO },
      ERROR: { value: LogType.ERROR },
    },
  });

  const GraphqlInputLogType = new GraphQLInputObjectType({
    name: 'InputLogType',
    fields: {
      type: { type: GraphqlLogType, description: '로그 타입' },
    },
  });

  const GraphqlTestObject = new GraphQLObjectType({
    name: 'TestObject',
    fields: {
      name: { type: GraphQLString },
    },
  });

  // test용 클래스
  @Resolver(() => Log)
  class testClass {
    @Query({
      returnType: () => GraphQLString,
      description: '쿼리 테스트',
    })
    test() {
      return 'test';
    }

    @Mutation({
      args: {
        names: () => GraphqlInputLogType,
      },
      description: '뮤테이션 테스트',
      returnType: () => GraphQLList(GraphqlTestObject),
    })
    test1() {
      return 'test';
    }

    @FieldResolver({
      parent: () => Log,
      returnType: () => GraphQLString,
      description: '필드 테스트',
    })
    do() {
      return '1';
    }

    @FieldResolver({
      parent: () => Log,
      returnType: () => Log2,
      description: '필드 테스트',
    })
    do2() {
      return '1';
    }
  }

  @ObjectType('Log2')
  class Log2 {
    @Field({
      returnType: () => GraphqlLogType,
      description: '일반 필드 테스트',
    })
    getLog2!: LogType;
  }
  @ObjectType('Log')
  class Log {
    @Field({
      returnType: () => GraphqlLogType,
      description: '일반 필드 테스트',
    })
    getLog!: LogType;
  }
  // 여기까지 test용 클래스

  const container = new Container({});
  container.boot();

  const graphqlFactory = container.getProvider(GraphqlFactory);

  graphqlFactory?.generate();
  const schema = printSchema(graphqlFactory!.getSchema()!);
  // console.log(schema);

  it('Auto Graphql Custom Type Test', () => {
    const schemaTexts = [
      'enum LogType',
      'input InputLogType',
      'type TestObject',
    ];
    expect(schemaTexts.every((text) => schema.includes(text))).toEqual(true);
  });
});
