import { GraphQLID, GraphQLString } from 'graphql';
import { Field } from '../../decorators/field.decorators';
import { ObjectType } from '../../decorators/objectType.decorators';

@ObjectType()
export class Project {
  @Field(() => GraphQLID)
  id!: number;

  @Field(() => GraphQLString)
  name!: string;
}
