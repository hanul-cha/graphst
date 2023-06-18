import { GraphQLInt, GraphQLString } from 'graphql';
import { Field, ObjectType } from 'graphst';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
// @Entity({ name: 'test_table' })
export class testTable {
  @Field({
    returnType: () => GraphQLInt,
  })
  //   @PrimaryGeneratedColumn()
  id!: number;

  @Field({
    returnType: () => GraphQLString,
  })
  //   @Column({ type: String })
  name!: string;
}
