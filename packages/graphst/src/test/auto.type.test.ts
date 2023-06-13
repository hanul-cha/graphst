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
    })
    test() {
      return 'test';
    }

    @Mutation({
      args: {
        names: () => GraphqlInputLogType,
      },
      returnType: () => GraphQLList(GraphqlTestObject),
    })
    test1() {
      return 'test';
    }
  }

  @ObjectType('Log')
  class Log {
    @Field(() => GraphqlLogType)
    getLog!: LogType;
  }
  // 여기까지 test용 클래스

  const container = new Container({});
  container.boot();

  const graphqlFactory = container.getProvider(GraphqlFactory);

  graphqlFactory.generate();
  const schema = printSchema(graphqlFactory.getSchema());
  console.log(schema);

  it('Auto Graphql Custom Type Test', () => {
    const schemaTexts = [
      'enum LogType',
      'input InputLogType',
      'type TestObject',
    ];
    expect(schemaTexts.every((text) => schema.includes(text))).toEqual(true);
  });
});
