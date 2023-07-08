import { GraphQLInt, GraphQLString } from 'graphql';
import { Field, ObjectType } from 'graphst';

@ObjectType()
export class TestTable2 {
  @Field({
    returnType: () => GraphQLInt,
  })
  id!: number;

  @Field({
    returnType: () => GraphQLString,
  })
  name!: string;
}
