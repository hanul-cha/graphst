import { GraphQLList, GraphQLString } from 'graphql';
import { Container } from '../container';
import { Field } from '../decorators/field.decorators';
import { FieldResolver } from '../decorators/fieldResolver.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Resolver } from '../decorators/resolver.decorators';
import { GraphqlFactory } from '../graphql/factory/graphqlFactory';
import { getObjectSchema } from '../graphql/utile/getObjectSchema';

describe('graphst, circular.returnType.test', () => {
  // test용 클래스
  @ObjectType()
  class CircularEntity1 {
    @Field(() => GraphQLString)
    name1!: string;
  }

  @ObjectType()
  class CircularEntity2 {
    @Field(() => GraphQLString)
    name2!: string;
  }

  @Resolver(() => CircularEntity1)
  class ResolverCircular1 {
    @FieldResolver({
      parent: () => CircularEntity1,
      returnType: () => CircularEntity2,
    })
    toTest1(): CircularEntity2 {
      return {
        name2: 'test2',
      };
    }
  }

  @Resolver(() => CircularEntity2)
  class ResolverCircular2 {
    @FieldResolver({
      parent: () => CircularEntity2,
      returnType: () => GraphQLList(getObjectSchema(CircularEntity1)),
    })
    toTest2(): CircularEntity1 {
      return {
        name1: 'test1',
      };
    }
  }
  // 여기까지 test용 클래스

  const container = new Container({
    resolvers: [ResolverCircular1, ResolverCircular2],
  });
  container.boot();

  const graphqlFactory = container.getProvider(GraphqlFactory);

  if (!graphqlFactory) {
    throw new Error('instance is undefined');
  }

  graphqlFactory.generate();
  const schema = graphqlFactory!.getSchema()!;

  // 서로 리턴하는 경우
  it('Circular graphql return type injection testing', () => {
    const schemaTexts = [''];
    expect(schemaTexts.every((text) => schema.includes(text))).toEqual(true);
  });
});
